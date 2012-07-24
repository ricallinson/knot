/*global phantom:true, console:true, WebPage:true, Date:true*/
(function () {
	var url,
        timeout,
        page,
        defer,
        test,
        scrapper,
        errorCount = 0;

	if (phantom.args.length < 1) {
		console.log("Usage: phantomjs phantomjs-mocha.js URL [timeout]");
		phantom.exit(1);
	}

	url = phantom.args[0];
	timeout = phantom.args[1] || 6000;

	page = new WebPage();

	defer = function (testFunc, scrapper) {
		var start, condition, func, interval, time, testStart;
		start = new Date().getTime();
		testStart = new Date().getTime();
		condition = false;
		func = function () {
			if (new Date().getTime() - start < timeout && condition !== testFunc()) {
				condition = testFunc();
			} else {
				if (!condition) {
					console.log("Timeout passed before the tests finished.");
					phantom.exit(1);
				} else {
					clearInterval(interval);
					time = Math.round((new Date().getTime() - testStart) / 100) / 10;
					console.log("Finished in " + time + "s.\n");
					scrapper();
					phantom.exit(errorCount ? 1 : 0);
				}
			}
		};
		interval = setInterval(func, 100);
	};
    test = function () {
        return page.evaluate(function () {
            return document.querySelector(".duration").innerText;
        });
    };
    scrapper = function () {
        var all, list, i, len;

        all = page.evaluate(function () {
            var specs, i, len, results = [];
            specs = document.querySelectorAll(".test");
            for (i = 0, len = specs.length; i < len; i += 1) {
                if (specs[i].getAttribute("class").search(/fail/) !== -1) {
                    console.log(specs[i].innerText);
                }
                results.push(specs[i].getAttribute("class").search(/fail/) === -1);
            }
            return results;
        });

        // Outputs a '.' or 'F' for each test
        console.log(all.reduce(function (str, a) {
            if (a !== true) {
                errorCount = errorCount + 1;
            }
            return str += (a) ? "." : "F";
        }, ""));

        list = page.evaluate(function () {
            var parseSuite, parseSuites, parseTests, extractNodes;

            extractNodes = function (nodes, match) {
                var i, len, regex, results = [];
                regex = new RegExp(match);
                for (i = 0, len = nodes.length; i < len; i += 1) {
                    if (nodes[i].getAttribute("class").search(regex) !== -1) {
                        results.push(nodes[i]);
                    }
                }
                return results;
            };

            parseTests = function(tests) {
                var i, len, messages = [];
                for (i = 0, len = tests.length; i < len; i += 1) {
                    messages.push(
                        tests[i].querySelector("h2").innerText + " - " +
                        tests[i].querySelector(".error").innerText
                    );
                }
                messages = messages.join("  \n");
                return messages;
            };

            parseSuite = function (suite, description) {
                var nested, tests, div, fails = [];
                div = suite.querySelector("div");
                if (typeof description === "undefined") {
                    description = [];
                }
                description.push(suite.querySelector("h1").innerText);
                tests = extractNodes(div.childNodes, "fail");
                if (tests.length) {
                    fails.push({
                        desc: description.join(" :: "),
                        msg: "  " + parseTests(tests)
                    });
                }
                nested = extractNodes(div.childNodes, "suite");
                if (nested.length) {
                    fails = fails.concat(parseSuites(nested, description));
                }
                return fails;
            };

            parseSuites = function (suites, description) {
                var i, len, fails = [];
                for (i = 0, len = suites.length; i < len; i += 1) {
                    fails = fails.concat(parseSuite(suites[i], description));
                }
                return fails;
            };

            return parseSuites(document.querySelectorAll("#mocha > .suite"), []);
        });

        // If the list of failures is not empty output the failure messages
        console.log("");
        if (list.length) {
            for (i = 0, len = list.length; i < len; i += 1) {
                console.log(list[i].desc + "\n" + list[i].msg + "\n");
            }
        }
    };
	page.onConsoleMessage = function (msg) { console.log(msg); };
	page.open(url, function (status) {
		if (status !== "success") {
			console.log("Failed to load the page. Check the url");
			phantom.exit(1);
		}
        defer(test, scrapper);
	});

}());
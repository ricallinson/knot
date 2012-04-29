/*
 * The main "process" namespace variable.
 */
var process = (function(){
    
    /*
     * This function eval's module code in the process scope.
     */
    function evalModuleInScope(js) {
        eval(js);
    }

    /*
     * Close the scope so when evalScope() is called the module cannot
     * access knot and its inner functions.
     */
    return function(){

//        var URL_PREFIX = process.installPrefix;

        /*
         * Provide the XMLHttpRequest constructor for Internet Explorer 5.x-6.x:
         * Other browsers (including Internet Explorer 7.x-9.x) do not redefine
         * XMLHttpRequest if it already exists.
         *
         * This example is based on findings at:
         * http://blogs.msdn.com/xmlteam/archive/2006/10/23/using-the-right-version-of-msxml-in-internet-explorer.aspx
         */

        if (typeof XMLHttpRequest === "undefined") {
            XMLHttpRequest = function() {
                try {
                    return new ActiveXObject("Msxml2.XMLHTTP.6.0");
                }
                catch (e) {}
                try {
                    return new ActiveXObject("Msxml2.XMLHTTP.3.0");
                }
                catch (e) {}
                try {
                    return new ActiveXObject("Microsoft.XMLHTTP");
                }
                catch (e) {}
                //Microsoft.XMLHTTP points to Msxml2.XMLHTTP and is redundant
                throw new Error("This browser does not support XMLHttpRequest.");
            };
        }

        /*
         * ClientModule
         */
        function ClientModule(id) {
            this.id = id;
            this.filename = null;
            this.uri = '';
            this.exports = {};
        }

        ClientModule.modules = {};
        ClientModule.cache = {};

        ClientModule.require = function(id, parentPath) {

            var cached,
                clientModule;

            cached = ClientModule.getCached(id);

            if (cached) {
                return cached.exports;
            }

            if (id.charAt(0) === '.') {
                id = ClientModule.require('path').join(parentPath, id);
            }

            if (id) {
                ClientModule.load(id);
            }

            if (!ClientModule.exists(id)) {
                throw new Error('No such client module ' + id);
            }

    //        process.moduleLoadList.push('ClientModule ' + id);

            clientModule = new ClientModule(id);

            clientModule.compile();
            clientModule.cache();

            return clientModule.exports;
        };

        ClientModule.getCached = function(id) {
            return ClientModule.cache[id];
        }

        /*
         * This function will load the module identifed by "name".
         *
         * If no callback is given the module will be loaded synchronously as a
         * string and then eval'd.
         *
         * If a callback is given the module will be loaded asynchronously in a
         * <script> tag with the callback being triggered once it's loaded.
         *
         * @param {string} id
         * @param {function} callback
         * @api private
         */

        ClientModule.load = function(id, callback) {

            var uri = process.installPrefix + id + '.js',
                script;

            if (!id) {
                throw new Error('First argument must be a string representing the name of the module.');
            }

            /*
             * If no callback is given load the script synchronously.
             */
            if (!callback) {
                script = new XMLHttpRequest();
                script.open("GET", uri, false);
                script.send(null);
                evalModuleInScope(script.responseText);
                return;
            }

            /*
             * Otherwise load it asynchronously.
             */
            script = document.createElement("script");
            script.type = "text/javascript";

            if (script.readyState) {  //IE
                script.onreadystatechange = function() {
                    if (script.readyState == "loaded" || script.readyState == "complete"){
                        script.onreadystatechange = null;
                        callback();
                    }
                };
            } else {  //Others
                script.onload = function() {
                    callback();
                };
            }

            script.src = uri;

            document.body.appendChild(script);
        }

        ClientModule.exists = function(id) {
            return ClientModule.modules.hasOwnProperty(id);
        }

        ClientModule.prototype.compile = function() {

            var module = this,
                dirname;

            module.uri = ClientModule.modules[module.id].uri;
            dirname = module.uri.split('/').slice(0, -1).join('/')

            // Doing this so I can pass the parent dirname to require.
            module.require = function(id) {
                return ClientModule.require(id, dirname);
            };

            ClientModule.modules[module.id].func(module.exports, module.require, module, module.uri, dirname);
        };

        ClientModule.prototype.cache = function() {
            ClientModule.cache[this.id] = this;
        };

        // Wrap a core module's method in a wrapper that will warn on first use
        // and then return the result of invoking the original function. After
        // first being called the original method is restored.
        ClientModule.prototype.deprecate = function(method, message) {
            var original = this.exports[method];
            var self = this;
            var warned = false;
            message = message || '';

            Object.defineProperty(this.exports, method, {
                enumerable: false,
                value: function() {
                    if (!warned) {
                        warned = true;
                        message = self.id + '.' + method + ' is deprecated. ' + message;

                        var moduleIdCheck = new RegExp('\\b' + self.id + '\\b');
                        if (moduleIdCheck.test(process.env.NODE_DEBUG))
                            console.trace(message);
                        else
                            console.error(message);

                        self.exports[method] = original;
                    }
                    return original.apply(this, arguments);
                }
            });
        };

        /*
         * The main function of the "knot" system.
         *
         * @param {string} id
         * @param {function} func
         * @param {object} meta
         * @api public
         */

        return function process(id, func, meta) {

            if (typeof id === 'function') {
                meta = func
                func = id;
                id = '';
            }

            if (typeof name !== 'string') {
                throw new Error('First argument must be a string representing the name of the module.');
            }

            if (ClientModule.exists(id)) {
                throw new Error('Module "' + id + '" has already been loaded.');
            }

            if (!func) {
                throw new Error('Second argument must be a function.');
            }

            if (!meta) {
                meta = {
                    uri: ''
                };
            }

            /*
             * Add the module to the "modules" map.
             */
            ClientModule.modules[id] = {
                uri: meta.uri,
                func: func
            }

            /*
             * If the module has no name then it should be required.
             */
            if (id === '') {
                ClientModule.require(id);
            }
        }
    }();
})();

/*
 * Prime the "process" variable as best we can.
 */
(function(){
    
    /*
     * The standard node functions attached to "process".
     */
    var name,
        functions = [
            'chdir',
            'exit',
            'getgid',
            'setgid',
            'getuid',
            'setuid',
            'kill',
            'memoryUsage',
            'nextTick',
            'umask',
            'uptime'
        ];

    /*
     * Attach a function which throws an error for each of the above
     * unsupported "process" functions.
     */
    for (name in functions) {
        if (functions.hasOwnProperty(name)) {
            process[functions[name]] = function() {
                throw new Error('Function is not available in Knot.');
            };
        }
    }

    process.stdout = {/* should be console */};
    process.stderr = {/* should be console */};
    process.stdin = {/* should be console */};
    process.argv = [];
    process.execPath = window.location.pathname;
    process.cwd = function() {
        return process.execPath;
    };
    process.env = '';
    process.version = '0.0.1';
    process.versions = {
        'knot': process.version,
        'arch': navigator.appVersion
    };
    process.installPrefix = '/knot/';
    process.pid = '';
    process.title = '';
    process.arch = navigator.appName;
    process.platform = navigator.platform;

}());
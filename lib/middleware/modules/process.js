//    (The MIT License)
//
//    Copyright (c) 2012 Richard S Allinson <rsa@mountainmansoftware.com>
//
//    Permission is hereby granted, free of charge, to any person obtaining
//    a copy of this software and associated documentation files (the
//    'Software'), to deal in the Software without restriction, including
//    without limitation the rights to use, copy, modify, merge, publish,
//    distribute, sublicense, and/or sell copies of the Software, and to
//    permit persons to whom the Software is furnished to do so, subject to
//    the following conditions:
//
//    The above copyright notice and this permission notice shall be
//    included in all copies or substantial portions of the Software.
//
//    THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
//    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
//    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
//    IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
//    CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
//    TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
//    SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

/*global XMLHttpRequest: true, ActiveXObject: true, document: true, window: true, navigator: true*/

//'use strict';

/*
 * The main "process" namespace variable.
 */

var process = (function () {

    /*
     * This function eval's module code in the process scope.
     *
     * @param {string} js
     * @api private
     */

    function evalModuleInScope(js) {
        eval(js);
    }

    /*
     * Close the scope so when evalScope() is called the module cannot
     * access knot and its inner functions.
     *
     * @api private
     */

    return (function () {

        /*
         * Provide the XMLHttpRequest constructor for Internet Explorer 5.x-6.x:
         * Other browsers (including Internet Explorer 7.x-9.x) do not redefine
         * XMLHttpRequest if it already exists.
         *
         * This example is based on findings at:
         * http://blogs.msdn.com/xmlteam/archive/2006/10/23/using-the-right-version-of-msxml-in-internet-explorer.aspx
         */

        if (typeof XMLHttpRequest === "undefined") {
            XMLHttpRequest = function () {
                try {
                    return new ActiveXObject("Msxml2.XMLHTTP.6.0");
                } catch (e) {}
                try {
                    return new ActiveXObject("Msxml2.XMLHTTP.3.0");
                } catch (er) {}
                try {
                    return new ActiveXObject("Microsoft.XMLHTTP");
                } catch (err) {}
                //Microsoft.XMLHTTP points to Msxml2.XMLHTTP and is redundant
                throw new Error("This browser does not support XMLHttpRequest.");
            };
        }

        /*
         * 
         */

        function getModuleParentPath(id) {
            return ClientModule.modules[id].filename.split('/').slice(0, -1).join('/');
        }

        /*
         * 
         */

        function resolveFilename(id, parentPath) {
            
            if (id.charAt(0) === '.') {

                if (!parentPath) {
                    // This value must match "ROOT_PKG" in node.js
                    parentPath = '_root_';
                }

                id = ClientModule.require('path').join(parentPath, id);
            }

            return id;
        }

        /*
         * ClientModule
         *
         * @param {string} id
         * @api private
         */

        function ClientModule(id) {
            this.id = id;
            this.filename = null;
            this.uri = '';
            this.exports = {};
        }

        /*
         * Function cache.
         */

        ClientModule.modules = {};

        /*
         * Object cache.
         */

        ClientModule.cache = {};

        /*
         * The "require()" function used by all modules.
         *
         * @param {string} id
         * @param {string} parentPath
         * @api private
         */

        ClientModule.require = function (id, parentPath) {

            var cached,
                clientModule;

            /*
             * Expand the name before we try and find it in the cache
             */
            
            id = resolveFilename(id, parentPath);

            cached = ClientModule.getCached(id);

            if (cached) {
                return cached.exports;
            }

            /*
             * If the module was not cached we load it here for the first time.
             */

            if (id && ClientModule.exists(id) === false) {
                ClientModule.load(id);
            }

            if (!ClientModule.exists(id)) {
                throw new Error('No such client module ' + id);
            }

            clientModule = new ClientModule(id);

            clientModule.compile();
            clientModule.cache();

            return clientModule.exports;
        };

        /*
         * Returns true if the id is a cached module.
         *
         * @param {string} id
         * @api private
         */

        ClientModule.getCached = function (id) {
            return ClientModule.cache[id];
        };

        /*
         * This function will load the module identifed by "name".
         *
         * If no callback is given the module will be loaded synchronously as a
         * string and then eval'd.
         *
         * If a callback is given the module will be loaded asynchronously in a
         * <script> tag with the callback being triggered once it's loaded.
         *
         * @param {string|array} id
         * @param {function} callback
         * @api private
         */

        ClientModule.load = function (id, callback) {

            var ids = id,
                uris = [];

            if (!id) {
                throw new Error('First argument must be a string representing the name of the module.');
            }

            /*
             * If we were given a string "id" convert it to an array.
             */

            if (typeof ids === 'string') {
                ids = [id];
            }

            /*
             * Now loop over all the "ids" and load them.
             */

            ids.forEach(function (id) {
                var uri = process.installPrefix + id + '.js',
                    script;
                if (!callback) {
                    // If no callback is given load the script synchronously.
                    script = new XMLHttpRequest();
                    script.open("GET", uri, false);
                    script.send(null);
                    evalModuleInScope(script.responseText);
                } else {
                    // Otherwise add the uri to the loading list
                    uris.push(uri);
                }
            });

            /*
             * If we have any "uris" load them asynchronously using LAB.js.
             */

            if (uris.length > 0) {
                $LAB.script(uris).wait(callback);
            }
        };

        /*
         * Checks if the given id exists.
         *
         * @param {string} id
         * @api private
         */

        ClientModule.exists = function (id) {
            return ClientModule.modules.hasOwnProperty(id);
        };

        /*
         * Run the function.
         *
         * @api private
         */

        ClientModule.prototype.compile = function () {

            var module = this,
                dirname;

            module.uri = ClientModule.modules[module.id].uri;
            // If the the filename is empty then use the uri
            module.filename = ClientModule.modules[module.id].filename || module.uri;
            // Get the directory of the module to use as the root for any other relative require calls.
            dirname = getModuleParentPath(module.id);

            // Doing this so I can pass the parent dirname to require.
            module.require = function (id) {
                return ClientModule.require(id, dirname);
            };

            ClientModule.modules[module.id].func(module.exports, module.require, module, module.uri, dirname);
        };

        /*
         * Add the current module to the cache.
         * 
         * @api private
         */

        ClientModule.prototype.cache = function () {
            ClientModule.cache[this.id] = this;
        };

        /*
         * Wrap a core module's method in a wrapper that will warn on first use
         * and then return the result of invoking the original function. After
         * first being called the original method is restored.
         *
         * @param {string} method
         * @param {string} message
         * @api private
         */

        ClientModule.prototype.deprecate = function (method, message) {
            var original = this.exports[method],
                self = this,
                warned = false;

            message = message || '';

            Object.defineProperty(this.exports, method, {
                enumerable: false,
                value: function () {
                    if (!warned) {
                        warned = true;
                        message = self.id + '.' + method + ' is deprecated. ' + message;

                        var moduleIdCheck = new RegExp('\\b' + self.id + '\\b');
                        if (moduleIdCheck.test(process.env.NODE_DEBUG)) {
                            console.trace(message);
                        } else {
                            console.error(message);
                        }

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

            var parentPath;

            if (typeof id === 'function') {
                meta = func;
                func = id;
                id = '';
            }

            if (typeof id !== 'string') {
                throw new Error('First argument must be a string representing the name of the module.');
            }

            if (ClientModule.exists(id)) {
//                throw new Error('Module "' + id + '" has already been loaded.');
                return;
            }

            if (!func) {
                throw new Error('Second argument must be a function.');
            }

            /*
             * The plan for meta is to have it contain an array of module
             * dependancies so they can be loaded asynchronously before the
             * module is executed. To do this the server side of knot will
             * need to provide the array as part of the process() functions
             * arguments.
             */

            if (!meta) {
                meta = {
                    uri: ''
                };
            }

            /*
             * Add the module to the "modules" map.
             *
             * This data is read in ClientModule.compile()
             */

            ClientModule.modules[id] = {
                uri: meta.uri,
                filename: meta.filename || meta.uri,
                func: func
            };

            /*
             * If the module has no name then it should be required immediately.
             */
            
            function callback() {
                if (id === '') {
                    ClientModule.require(id);
                }
            }

            /*
             * Load any modules found in meta.requires
             */

            if (meta.requires && meta.requires.length > 0) {

                // Get the directory of the module to use as the root for any other relative require calls.
                parentPath = getModuleParentPath(id);

                // Now loop over any modules we have and expand their module ids.
                meta.requires.forEach(function (moduleId, pos) {
                    // Make the paths relative to the current module
                    if (moduleId.charAt(0) === '.') {
                        meta.requires[pos] = resolveFilename(moduleId, parentPath);
                    }
                });

//                ClientModule.load(meta.requires, callback);
            } else {
                callback();
            }
        };
    }());

}());

/*
 * Prime the "process" variable as best we can.
 */

(function () {

    /*
     * The standard node functions attached to "process".
     */

    var start = new Date().getSeconds(),
        stream = {},
        name,
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
            'umask'
        ];

    /*
     * Attach a function which throws an error for each of the above
     * unsupported "process" functions.
     */

    for (name in functions) {
        if (functions.hasOwnProperty(name)) {
            process[functions[name]] = function () {
                throw new Error('Function is not available in Knot.');
            };
        }
    }

    /*
     * build a simple stream object
     */

    stream.writable = true;
    stream.destroy = function () {};
    stream.destroySoon = function () {};
    stream.write = function (string) {
        if (typeof string === 'Buffer') {
            string = string.toString();
        }
        console.log(string);
    };
    stream.end = function (string) {
        stream.write(string);
    };

    /*
     * Supply data where we can.
     */

    process.stdout = stream;
    process.stderr = stream;
    process.stdin = {/* should be console */};
    process.argv = [];
    process.execPath = window.location.pathname;
    process.cwd = function () {
        return process.execPath;
    };
    process.env = undefined;
    process.version = '0.0.3';
    process.versions = {
        'knot': process.version,
        'arch': navigator.appVersion
    };
    process.installPrefix = '/knot/';
    process.pid = '';
    process.title = '';
    process.arch = navigator.appName;
    process.platform = navigator.platform;
    process.uptime = function () {
        var cur = new Date().getSeconds();
        return cur - start;
    };

}());
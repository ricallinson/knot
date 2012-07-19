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

        function Module(id, parent) {
            this.id = id;
            this.exports = {};
            this.parent = parent;
            if (parent && parent.children) {
                parent.children.push(this);
            }

            this.filename = null;
            this.loaded = false;
            this.children = [];
        }

        /*
         * Function cache.
         */

        Module.modules = {};

        /*
         * Object cache.
         */

        Module.cache = {};

        /*
         * Returns the directory of the given file path
         */

        Module.getDirname = function (filepath) {
            return filepath.split('/').slice(0, -1).join('/');
        }

        /*
         * Get the path to the modules filename
         */

        Module.resolveFilename = function (id, parent) {

            var path = '';

            if (id.charAt(0) === '.') {

                if (!parent.filename) {
                    // This value must match "ROOT_PKG" in node.js
                    path = '_root_';
                } else {
                    path = Module.load('path').dirname(parent.filename);
                }

                id = Module.load('path').join(path, id);
            }

            return id;
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
         * @param {string|array} id
         * @param {function} callback
         * @api private
         */

        Module.loadId = function (id, callback) {

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
                    // Add the uri to the loading list
                    uris.push(uri);
                }
            });

            /*
             * If we have any "uris" load them asynchronously.
             */

            if (uris.length > 0) {
                // asynchronously
            }

            /*
             * If we were given a callback, call it.
             */

            if (callback) {
                callback();
            }
        };

        /*
         * Returns true if the id is a cached module.
         *
         * @param {string} id
         * @api private
         */

        Module.getCached = function (id) {
            return Module.cache[id];
        };
        
        /*
         * The "load()" function used by all modules.
         *
         * @param {string} id
         * @param {string} parent
         * @api private
         */

        Module.load = function (id, parent) {

            var cached,
                module;

            /*
             * Expand the name before we try and find it in the cache
             */

            id = Module.resolveFilename(id, parent);

            cached = Module.getCached(id);

            if (cached) {
                return cached.exports;
            }

            /*
             * If the module was not cached we load it here for the first time.
             */

            if (id && Module.exists(id) === false) {
                Module.loadId(id);
            }

            if (!Module.exists(id)) {
                throw new Error('No such client module ' + id);
            }

            module = new Module(id, parent);

            module.compile();
            module.cache();

            return module.exports;
        };

        /*
         * The public require() function
         */

        Module.prototype.require = function (path) {
            return Module.load(path, this);
        };

        /*
         * Checks if the given id exists.
         *
         * @param {string} id
         * @api private
         */

        Module.exists = function (id) {
            return Module.modules.hasOwnProperty(id);
        };

        /*
         * Run the function.
         *
         * @api private
         */

        Module.prototype.compile = function () {

            var self = this,
                dirname;

            function require(path) {
                return self.require(path);
            }

            self.uri = Module.modules[self.id].uri;
            // If the the filename is empty then use the uri
            self.filename = Module.modules[self.id].filename || self.uri;
            // Set the loaded flag
            self.loaded = true;
            // Set the __dirname
            dirname = Module.getDirname(self.uri);
            // Finally call the function to finish the complie
            Module.modules[self.id].func.apply(self, [self.exports, require, self, self.uri, dirname]);
        };

        /*
         * Add the current module to the cache.
         *
         * @api private
         */

        Module.prototype.cache = function () {
            Module.cache[this.id] = this;
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

        Module.prototype.deprecate = function (method, message) {
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

            if (typeof id === 'function') {
                meta = func;
                func = id;
                id = '';
            }

            if (typeof id !== 'string') {
                throw new Error('First argument must be a string representing the name of the module.');
            }

            if (Module.exists(id)) {
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
             * This data is read in Module.compile()
             */

            Module.modules[id] = {
                uri: meta.uri,
                filename: meta.filename || meta.uri,
                func: func
            };

            /*
             * If the module has no name then it should be required immediately.
             */

            if (id === '') {
                Module.load(id);
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
//            'nextTick',
            'umask'
        ];

    /*
     * Attach a function which throws an error for each of the above
     * unsupported "process" functions.
     */

    for (name in functions) {
        if (functions.hasOwnProperty(name)) {
            process[functions[name]] = function () {
                throw new Error('Function "' + functions[name] + '" is not available in Knot.');
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

    // Taken from Mocha

    /*
     * next tick implementation.
     */

    process.nextTick = (function(){
      // postMessage behaves badly on IE8
      if (window.ActiveXObject || !window.postMessage) {
        return function(fn){ fn() };
      }

      // based on setZeroTimeout by David Baron
      // - http://dbaron.org/log/20100309-faster-timeouts
      var timeouts = []
        , name = 'mocha-zero-timeout'

      window.addEventListener('message', function(e){
        if (e.source == window && e.data == name) {
          if (e.stopPropagation) e.stopPropagation();
          if (timeouts.length) timeouts.shift()();
        }
      }, true);

      return function(fn){
        timeouts.push(fn);
        window.postMessage(name, '*');
      }
    })();

    /**
     * Remove uncaughtException listener.
     */

    process.removeListener = function(e){
      if ('uncaughtException' == e) {
        window.onerror = null;
      }
    };

    /**
     * Implements uncaughtException listener.
     */

    process.on = function(e, fn){
      if ('uncaughtException' == e) {
        window.onerror = fn;
      }
    };

}());
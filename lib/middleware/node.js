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

/*jslint stupid: true, nomen: true*/

'use strict';

/*
 * Load modules
 */

var fs = require('fs'),
    path = require('path'),
    parse = require('url').parse,
    minify = require("uglify-js");

/*
 * Constants
 */

var PACKAGE = 'package.json',
    KNOT_PREFIX = '/knot/',
    ROOT_PKG = '_root_';

/*
 * Cache
 */

var cache = {};

/**
 * decodeURIComponent.
 *
 * Allows V8 to only deoptimize this fn instead of all
 * of send().
 *
 * @param {String} path
 * @api private
 */

function decode(path) {
    try {
        return decodeURIComponent(path);
    } catch (err) {
        return err;
    }
}

/**
 * Attempt to tranfer the requested file to `res`.
 *
 * @param {ServerRequest} req
 * @param {ServerResponse} res
 * @param {Function} next
 * @param {Object} options
 * @api private
 *
 * options.minify = true | false
 */

function serve(req, res, next, options) {

    var head,
        get,
        getOnly,
        url,
        //path,
        file,
        start, // Var for wrapping the raw file
        middle, // Var to hold the raw file
        end, // Var for wrapping the raw file
        rawjs, // Var for the minify process
        ast; // Var for the minify process

    options = options || {};

    if (!options.path) {
        throw new Error('Path required.');
    }

    // setup
    head = 'HEAD' === req.method;
    get = 'GET' === req.method;
    getOnly = options.getOnly;

    // ignore non-GET requests
    if (getOnly && !get && !head) {
        next();
        return;
    }

    // parse url
    url = parse(options.path);
    //path = decode(url.pathname);
    file = options.modules[decode(url.pathname)];

    /*
     * If no file is found but the URL starts with "/knot" serve a dummy.js file.
     * This is so the client side code keeps running as this file could
     * have be auto detected by mistake.
     */

    if (!file && decode(url.pathname).indexOf('/knot') === 0) {
        console.log('Warning: Node module not found for url "'+decode(url.pathname) + '"');
        file = options.modules['/knot/dummy.js'];
    }

    /*
     * If the value of file is empty, return.
     */
    if (!file) {
        next();
        return;
    }

    if (options.cache && cache[file.path]) {
        res.end(cache[file.path]);
//        console.log('cache hit: ' + file.path);
        return;
    }

    /*
     * Generate the start and end JS for the module
     */

    start = "process('" + file.name + "', function(exports, require, module, __filename, __dirname) {\n";
    middle = fs.readFileSync(file.path, 'utf8');
    end = "\n}, " + JSON.stringify({
        uri: file.uri,
        filename: file.filename,
        requires: file.requires
    }) + ");";
    rawjs = start + middle + end;

    /*
     * If the request is for the the "process" we do something special.
     */

    if (file.name === 'process') {
        // Here we take the raw file and then append LAB.js to it.
        rawjs = middle + '\n' + fs.readFileSync(path.join(__dirname, '../labjs/LAB.js'), 'utf8');
    }

    /*
     * If the minify option is set to true apply it here.
     */

    if (options.minify) {
        ast = minify.parser.parse(rawjs); // parse code and get the initial AST
        ast = minify.uglify.ast_mangle(ast); // get a new AST with mangled names
        ast = minify.uglify.ast_squeeze(ast); // get an AST with compression optimizations
        rawjs = minify.uglify.gen_code(ast); // compressed code here
    }

    /*
     * If the cache option is set store the rawjs here.
     */

    if (options.cache) {
        cache[file.path] = rawjs;
    }

    res.write(rawjs);

    res.end();
}

/*
 * Given some meta data this function will add an entry to the module object.
 * It will also attempt to find any required modules in the file using regex.
 *
 * @private
 * @method makeModuleMapEntry
 * @param {string} dir
 * @param {string} uri
 * @param {string} filename
 * @param {string} name
 * @param {string} file
 * @param {object} modules
 * @return {object}
 *
 *  {
 *      name: name,
 *      path: {string},
 *      uri: uri,
 *      filename: filename,
 *      requires: array
 *  }
 */

function makeModuleMapEntry(dir, uri, filename, name, file, modules) {

    var filepath = path.join(dir, file + '.js'),
        rawjs,
        requires;

    /*
     * Here we try and find any required modules using "regex"
     */

    try {
        rawjs = fs.readFileSync(filepath, 'utf8');
    } catch (err) {
        console.log('Module "' + name + '" not found at: ' + filepath);
        return {};
    }

    requires = rawjs.match(/require\(('|")(.*?)('|")\)/g);

    if (requires) {
        requires.forEach(function (require, pos) {
            requires[pos] = require.match(/['|"](.*)['|"]/)[1];
//            console.log(requires[pos]);
        });
    } else {
        // If there is nothing found reset the "requires" var to "undefined"
        // so it does not get processed if JSON.stringify() is used later.
        requires = undefined;
    }
//    console.log(JSON.stringify(requires, null,4));
    /*
     * With all the information now collected we build the final object.
     */

    modules[KNOT_PREFIX + uri] = {
        name: name,
        path: filepath,
        uri: uri,
        filename: filename,
        requires: requires
    };

    return modules[KNOT_PREFIX + uri];
}

/*
 * This function looks for a <dir>/package.json file. If one is found it then
 * sees if there is a knot entry and each file it finds it adds to the
 * "modules" object. NOTE: Only the files found here will be served by knot.
 *
 *  "<dir>/package.json"
 *  
 *  knot: {
 *      modules: [
 *          <relative_path>
 *      ]
 *  }
 *
 * "modules"
 *
 *  {
 *      <uri>: {
 *          name: <module_name>/<relative_path>
 *          path: <abs_path_to_file>
 *          uri: <uri>
 *      }
 *  }
 *
 * @param {string} dir
 * @param {Object} modules
 * @api private
 */

function parsePackage(dir, modules, HACK) {

    var pack,
        name = HACK, // this may not be set so do it here
        files,
        file,
        uri,
        filename;

    try {
        pack = JSON.parse(fs.readFileSync(path.join(dir, PACKAGE), 'utf8'));
    } catch (err) {
        console.log(err);
        return;
    }

    /*
     * Get the package name from package.json.
     * However, if we were given a package name don't do anything.
     */

    if (!name) {
        name = pack.name;
    }

    if (pack.knot) {
        if (pack.knot.modules) {
            files = pack.knot.modules;
            for (file in files) {
                if (files.hasOwnProperty(file)) {
                    // Generate the knot filename for this module.
                    filename = (name ? name + '/' : '') + files[file] + '.js';

                    // Add the file to the modules map. We use the filename as the URL here because they are the same.
                    makeModuleMapEntry(dir, filename, undefined, ((name ? name + '/' : '') + files[file]), files[file], modules);

                    // If the file name is "index.js" then we have to add an
                    // entry for the diretory that points to the "index.js" frile.
                    if (files[file].slice(-5) === 'index') {
                        // Generate the knot url for this module.
                        if (files[file].slice(0, -5)) {
                            uri = (name ? name + '/' : '') + files[file].slice(0, -6);
                        } else {
                            uri = name;
                        }
                        // Add the file to the modules map.
                        makeModuleMapEntry(dir, uri + '.js', filename, uri, files[file], modules);
                    }
                }
            }
        }
    }
}

/*
 * From the given directory this function walks the directory tree to find
 * any "package.json" files. For each one found it calls "parsePackage()".
 *
 * @param {string} dir
 * @param {Object} modules
 * @api private
 */

function findModules(dir, modules, HACK) {

    var files,
        name,
        absPath;

    if (!modules) {
        modules = {};
    }

    files = fs.readdirSync(dir);

    for (name in files) {
        if (files.hasOwnProperty(name)) {
            absPath = path.join(dir, files[name]);
            if (files[name] === PACKAGE) {
                parsePackage(dir, modules, HACK);
            } else if (fs.statSync(absPath).isDirectory()) {
                findModules(absPath, modules);
            }
        }
    }

    return modules;
}

/**
 * Returns the knot connect middleware funciton.
 *
 * @param {ServerRequest} root
 * @param {ServerResponse} options
 * @api public
 */

module.exports = function (root, options) {

    var modules = {};

    // set options if not provided
    options = options || {};

    if (!root) {
        root = process.cwd();
    }

    // Set the root and other options
    options.root = root;
    options.getOnly = true;
    options.modules = modules;

    // Find all public modules. As this is the first package it is treated special.
    findModules(options.root, modules, ROOT_PKG);
    // Find all system modules
    findModules(path.join(__dirname, 'modules'), modules);

    return function (req, res, next) {
        options.path = req.url;
        serve(req, res, next, options);
    };
};
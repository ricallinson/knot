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

/*
 * Load modules
 */

var fs = require('fs'),
    path = require('path'),
    parse = require('url').parse;

/*
 * Constants
 */

var PACKAGE = 'package.json',
    KNOT_PREFIX = '/knot/';

/**
 * decodeURIComponent.
 *
 * Allows V8 to only deoptimize this fn instead of all
 * of send().
 *
 * @param {String} path
 * @api private
 */

function decode(path){
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
 */

function serve(req, res, next, options) {

    var head,
    get,
    getOnly,
    url,
    path,
    file;

    options = options || {};

    if (!options.path) {
        throw new Error('Path required.');
    }

    // setup
    head = 'HEAD' == req.method;
    get = 'GET' == req.method;
    getOnly = options.getOnly;

    // ignore non-GET requests
    if (getOnly && !get && !head) {
        next();
        return;
    }

    // parse url
    url = parse(options.path)
    path = decode(url.pathname);
    file = options.modules[path];

    /*
     * If the value of file is empty, return.
     */
    if (!file) {
        next();
        return;
    }

    if (file.name !== 'knot') {
        res.write("process('" + file.name + "', function(exports, require, module, __filename, __dirname) {");
    }

    res.write(fs.readFileSync(file.path));

    if (file.name !== 'knot') {
        res.write("}, {uri: '" + file.uri + "'});");
    }

    res.end();
}

/*
 * This function looks for a <dir>/package.json file. If one is found it then
 * sees if there is a knot entry and each file it finds to the "modules" object.
 *
 *  "<dir>/package.json"
 *  
 *  knot: {
 *      client: [
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

function parsePackage(dir, modules) {

    var pack,
        name,
        files,
        file,
        uri;

    try {
        pack = JSON.parse(fs.readFileSync(path.join(dir, PACKAGE), 'utf8'));
    } catch (err) {
        console.log(err);
        return;
    }

    name = pack.name;

    if (pack.knot) {
        if (pack.knot.client) {
            files = pack.knot.client;
            for (file in files) {
                if (files.hasOwnProperty(file)) {
                    // Add the file to the modules map.
                    uri = (name ? name + '/' : '' ) + files[file] + '.js';
                    modules[KNOT_PREFIX + uri] = {
                        name: (name ? name + '/' : '' ) + files[file],
                        path: path.join(dir, files[file] + '.js'),
                        uri: uri
                    };
                }
            }
        }

        if (pack.knot.main) {
            uri = (name ? name + '/' : '' ) + files[file] + '.js';
            modules[KNOT_PREFIX + uri] = {
                name: name,
                path: path.join(dir, files[file] + '.js'),
                uri: uri
            };
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

function findModules(dir, modules) {

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
                parsePackage(dir, modules);
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

exports = module.exports = function(root, options){
    
    var modules = {};

    // set options if not provided
    options = options || {};
    // root required
    if (!root) {
        throw new Error('knot() root path required');
    }
    // Set the root
    options.root = root;
    // Find all public modules
    findModules(options.root, modules);
    // Find all system modules
    findModules(path.join(__dirname, 'lib'), modules);

    return function(req, res, next) {
        options.path = req.url;
        options.getOnly = true;
        options.modules = modules;
        serve(req, res, next, options);
    };
};
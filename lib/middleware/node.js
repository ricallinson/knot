
var fs = require('fs'),
    path = require('path'),
    parse = require('url').parse;

var PACKAGE = 'package.json',
    URL_PREFIX = '/knot/';

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
                    modules[URL_PREFIX + uri] = {
                        name: (name ? name + '/' : '' ) + files[file],
                        path: path.join(dir, files[file] + '.js'),
                        uri: uri
                    };
                }
            }
        }

//        if (pack.knot.main) {
//            uri = name + '/' + pack.knot.main + '.js';
//            modules[URL_PREFIX + uri] = {
//                name: name,
//                path: path.join(dir, pack.knot.main + '.js'),
//                uri: uri
//            };
//        }
    }
}

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
 * Returns a connect middleware funciton.
 *
 * @param {ServerRequest} root
 * @param {ServerResponse} options
 * @api public
 */

exports = module.exports = function(root, options){

    var modules = {};

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

//    console.log(modules);

    return function(req, res, next) {
        options.path = req.url;
        options.getOnly = true;
        options.modules = modules;
        serve(req, res, next, options);
    };
};
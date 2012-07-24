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
 * Load required modules
 */

var connect = require('connect'),
    knot = require('../../'),
    app = connect.createServer(),
    exec = require('child_process').exec,
    localTest = process.argv[2] === 'local' ? true : false,
    phantomjs = process.argv[3] || 'phantomjs';

/*
 * Tell connect to use the knot middleware.
 */

app.use(knot.node(__dirname));

/*
 * Server some staic files for mocha
 */

app.use(connect.static(__dirname + '/static'));

/*
 * Add a simple function to serve the index.html file
 */

app.use(function (req, res) {
    res.end(require('fs').readFileSync('./static/index.html'));
});

/*
 * Listen for requests on http://localhost:3000/
 */

app.listen(3000);

if (localTest) {
    return; // this lets us test the tests locally
}

/*
 * Now run the Mocha tests in Phantomjs
 */

exec(phantomjs + ' ' + __dirname + '/phantomjs-mocha.js http://localhost:3000/', function (error, stdout, stderr) {
  console.log(stdout);
  if (error !== null) {
      process.exit(1);
  } else {
      process.exit();
  }
});

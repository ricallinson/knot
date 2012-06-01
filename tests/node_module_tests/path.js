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

'use strict';

var path = require('path');

console.log(path.normalize('/foo/bar//baz/asdf/quux/..')); // /foo/bar/baz/asdf
console.log(path.join('/foo', 'bar', 'baz/asdf', 'quux', '..')); // /foo/bar/baz/asdf
console.log(path.join('foo', {}, 'bar')); // foo/bar
console.log(path.resolve('/foo/bar', './baz')); // /foo/bar/baz
console.log(path.resolve('/foo/bar', '/tmp/file/')); // /tmp/file
console.log(path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif')); // '/wwwroot/static_files/gif/image.gif'
console.log(path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb')); // ../../impl/bbb
console.log(path.dirname('/foo/bar/baz/asdf/quux')); // /foo/bar/baz/asdf
console.log(path.basename('/foo/bar/baz/asdf/quux.html')); // quux.html
console.log(path.basename('/foo/bar/baz/asdf/quux.html', '.html')); // quux
console.log(path.extname('index.html')); // .html
console.log(path.extname('index.')); // .
console.log(path.extname('index')); // ''
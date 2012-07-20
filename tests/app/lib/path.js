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
var assert = require('assert');

describe('path', function () {

    describe('.resolve()', function () {
        it('should return /foo/bar/baz', function () {
            assert.equal(path.resolve('/foo/bar', './baz'), '/foo/bar/baz');
        });
        it('should return /tmp/file', function () {
            assert.equal(path.resolve('/foo/bar', '/tmp/file/'), '/tmp/file');
        });
        it('should return /wwwroot/static_files/gif/image.gif', function () {
            assert.equal(path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif'), '/wwwroot/static_files/gif/image.gif');
        });
    });

    describe('.normalize()', function () {
        it('should return /foo/bar/baz/asdf', function () {
            assert.equal(path.normalize('/foo/bar//baz/asdf/quux/..'), '/foo/bar/baz/asdf');
        });
    });

    describe('.join()', function () {
        it('should return /foo/bar/baz/asdf', function () {
            assert.equal(path.join('/foo', 'bar', 'baz/asdf', 'quux', '..'), '/foo/bar/baz/asdf');
        });
        it('should return foo/bar', function () {
            assert.equal(path.join('foo', {}, 'bar'), 'foo/bar');
        });
    });

    describe('.relative()', function () {
        it('should return ../../impl/bbb', function () {
            assert.equal(path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb'), '../../impl/bbb');
        });
    });

    describe('.dirname()', function () {
        it('should return /foo/bar/baz/asdf', function () {
            assert.equal(path.dirname('/foo/bar/baz/asdf/quux'), '/foo/bar/baz/asdf');
        });
    });

    describe('.basename()', function () {
        it('should return quux.html', function () {
            assert.equal(path.basename('/foo/bar/baz/asdf/quux.html'), 'quux.html');
        });
        it('should return quux', function () {
            assert.equal(path.basename('/foo/bar/baz/asdf/quux.html', '.html'), 'quux');
        });
    });

    describe('.extname()', function () {
        it('should return .html', function () {
            assert.equal(path.extname('index.html'), '.html');
        });
        it('should return .', function () {
            assert.equal(path.extname('index.'), '.');
        });
        it('should return empty string', function () {
            assert.equal(path.extname('index'), '');
        });
    });
});

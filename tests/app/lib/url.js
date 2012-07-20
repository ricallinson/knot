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

var url = require('url');
var assert = require('assert');

describe('url', function () {

    var fixture = 'http://user:pass@host.com:8080/p/a/t/h?query=string#hash';

    describe('parse', function () {
        it('should return an object', function () {
            var test = url.parse(fixture);
            assert.equal(test.auth, 'user:pass', test.auth);
            assert.equal(test.hash, '#hash', test.hash);
            assert.equal(test.host, 'host.com:8080', test.host);
            assert.equal(test.hostname, 'host.com', test.hostname);
            assert.equal(test.href, fixture, test.href);
            assert.equal(test.path, '/p/a/t/h?query=string', test.path);
            assert.equal(test.pathname, '/p/a/t/h', test.pathname);
            assert.equal(test.port, '8080', test.port);
            assert.equal(test.protocol, 'http:', test.protocol);
            assert.equal(test.query, 'query=string', test.query);
            assert.equal(test.search, '?query=string', test.search);
            assert.equal(test.slashes, true, test.slashes);
        });
        it('should return the string "string"', function () {
            var test = url.parse(fixture, true);
            assert.equal(test.query.query, 'string', test.query.query);
        });
        it('should return the host "foo"', function () {
            var test = url.parse('//foo/bar', false, false);
            assert.equal(test.host, undefined, test.host);
            assert.equal(test.pathname, '//foo/bar', test.pathname);
        });
        it('should return the host "foo"', function () {
            var test = url.parse('//foo/bar', false, true);
            assert.equal(test.host, 'foo', test.host);
            assert.equal(test.pathname, '/bar', test.pathname);
        });
    });

    describe('format', function () {
        it('should return the fixture as a string url', function () {
            var test = url.parse(fixture, true);
            assert.equal(url.format(test), fixture, url.format(test));
        });
    });

    describe('format', function () {
        it('should return the fixture as a string url', function () {
            var from = 'http://some.server.com/path',
                to = '../path/index.html'; //'http://some.server.com/';

            assert.equal(url.resolve(from, to), 'http://some.server.com/path/index.html', url.resolve(from, to));
        });
    });
});

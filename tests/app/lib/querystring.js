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

var qs = require('querystring');
var assert = require('assert');

describe('querystring', function () {
    describe('stringify', function () {
        it('should return "foo=bar&baz=qux&baz=quux&corge="', function () {
            var str = qs.stringify({ foo: 'bar', baz: ['qux', 'quux'], corge: '' });
            assert.equal(str, 'foo=bar&baz=qux&baz=quux&corge=', str);
        });
        it('should return "foo:bar;baz:qux"', function () {
            var str = qs.stringify({foo: 'bar', baz: 'qux'}, ';', ':');
            assert.equal(str, 'foo:bar;baz:qux', str);
        });
    });

    describe('parse', function () {
        it('should return object', function () {
            var obj = qs.parse('foo=bar&baz=qux&baz=quux&corge');
            assert.equal(obj.foo, 'bar', obj.foo);
            assert.equal(obj.baz[0], 'qux', obj.foo);
        });
    });

    describe('escape', function () {
        it('should return "foo%26bar%3Dbaz"', function () {
            var str = qs.escape('foo&bar=baz');
            assert.equal(str, 'foo%26bar%3Dbaz', str);
        });
    });

    describe('unescape', function () {
        it('should return "foo&bar=baz"', function () {
            assert.throws(
                function () {
                    var str = qs.unescape('foo%26bar%3Dbaz');
                    assert.equal(str, 'foo&bar=baz', str);
                },
                Error
            );
        });
    });
});

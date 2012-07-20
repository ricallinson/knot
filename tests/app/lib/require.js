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

var assert = require('assert');
var util = require('util');

describe('module', function () {

    describe('.exports', function () {
        it('should return an object', function () {
            assert.equal(typeof module.exports, 'object');
        });
    });

    describe('.require()', function () {
        it('should return a function', function () {
            assert.equal(typeof module.require, 'function');
        });
    });

    describe('.id', function () {
        it('should return "_root_/lib/require"', function () {
            assert.equal(module.id, '_root_/lib/require');
        });
    });

    describe('.filename', function () {
        it('should return "_root_/lib/require.js"', function () {
            assert.equal(module.filename, '_root_/lib/require.js');
        });
    });

    describe('.loaded', function () {
        it('should return true', function () {
            assert.equal(module.loaded, true);
        });
    });

    describe('.parent', function () {
        it('should return an object', function () {
            assert.equal(typeof module.parent, 'object');
        });
    });

    describe('.children', function () {
        it('should return an Array', function () {
            assert.equal(util.isArray(module.children), true);
        });
    });

    describe('require("nested_test")', function () {
        it('should ', function () {
            var nested = require('nested_test/index');
            assert.equal(nested.test(), 1);
        });
        it('should ', function () {
            var nested = require('nested_test');
            assert.equal(nested.test(), 1);
        });
        it('should ', function () {
            var nested = require('nested_test');
            assert.equal(nested.module(), 1);
        });
    });

    describe('require("nested_test")', function () {
        it('should ', function () {
            var inc = require('simple_module/lib/increment').increment,
                a = 1;
            assert.equal(inc(a), 2, inc(a));
        });
        it('should ', function () {
            var inc = require('simple_module').increment,
                a = 1;
            assert.equal(inc(a), 2, inc(a));
        });
    });
});

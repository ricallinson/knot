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

/*global describe: true, it: true*/

'use strict';

var assert = require('assert');

describe('assert', function () {
    describe('as function', function () {
        it('should return true', function () {
            assert(false, "my assert message");
        });
    });

    describe('.ok()', function () {
        it('should return true', function () {
            assert.ok(true, "my assert ok message");
        });
    });

    describe('.equal()', function () {
        it('should return true', function () {
            assert.equal(1, 1, 'message');
        });
    });

    describe('.notEqual()', function () {
        it('should return true', function () {
            assert.notEqual(1, 2, 'message');
        });
    });

    describe('.strictEqual()', function () {
        it('should return true', function () {
            assert.strictEqual('a', 'a', 'message');
        });
    });

    describe('.notStrictEqual()', function () {
        it('should return true', function () {
            assert.notStrictEqual('a', 'b', 'message');
        });
    });

    describe('.ifError()', function () {
        it('should return true', function () {
            assert.ifError(false);
        });
    });

    describe('.throws()', function () {
        it('should return true', function () {
            assert.throws(
                function () {
                    throw new Error("Wrong value");
                },
                Error
            );
        });
    });

    describe('.doesNotThrow()', function () {
        it('should return true', function () {
            assert.doesNotThrow(
                function () {
                    // No throw here
                },
                Error
            );
        });
    });

    describe('.fail()', function () {
        it('should return true', function () {
            assert.throws(
                function () {
                    assert.fail('a', 'b', 'message', 'operator');
                },
                Error
            );
        });
    });

    describe('.deepEqual()', function () {
        it('should return true', function () {
            assert.throws(
                function () {
                    assert.deepEqual({a: {b: [1, 2]}}, {a: {b: [1, 2]}});
                },
                Error
            );
        });
    });

    describe('.notDeepEqual()', function () {
        it('should return true', function () {
            assert.throws(
                function () {
                    assert.deepEqual({a: {b: [1, 2]}}, {a: {b: [1, 2, 3]}});
                },
                Error
            );
        });
    });
});

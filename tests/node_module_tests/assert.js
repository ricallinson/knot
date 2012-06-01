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

assert.throws(
    function () {
        assert.fail('a', 'b', 'message', 'operator');
    },
    Error
);
assert(true, "my assert message");
assert.ok(true, "my assert ok message");
assert.equal(1, 1, 'message');
assert.notEqual(1, 2, 'message');

// Requires Buffer
//assert.deepEqual({a: {b: [1, 2]}}, {a: {b: [1, 2]}}, 'message');
//assert.notDeepEqual({a: {b: [1, 2]}}, {a: {b: [1, 2, 3]}}, 'message');

assert.strictEqual('a', 'a', 'message');
assert.notStrictEqual('a', 'b', 'message');
assert.throws(
    function () {
        throw new Error("Wrong value");
    },
    Error
);
assert.doesNotThrow(
    function () {
        // No throw here
    },
    Error
);
assert.ifError(false);

var assert = require('assert');

assert.throws(
    function() {
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
    function() {
        throw new Error("Wrong value");
    },
    Error
);
assert.doesNotThrow(
    function() {
        // No throw here
    },
    Error
);
assert.ifError(false);
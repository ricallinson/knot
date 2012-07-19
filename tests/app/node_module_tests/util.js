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

//'use strict';

var util = require('util');
var assert = require('assert');

describe('util', function () {

    var stream = {};

    before(function (done) {

        stream.write = function (string) {
            if (typeof string === 'Buffer') {
                string = string.toString();
            }
            this.lastMessage = string;
        };
        stream.end = function (string) {
            stream.write(string);
        };

        /*
         * Supply data where we can.
         */
        stream.stdout = process.stdout;
        stream.stderr = process.stderr;

        process.stdout = stream;
        process.stderr = stream;

        done();
    });

    after(function (done) {

        process.stdout = stream.stdout;
        process.stderr = stream.stderr;

        done();
    });

    describe('.format()', function () {
        it('should return foo:bar baz', function () {
            assert.equal(util.format('%s:%s', 'foo', 'bar', 'baz'), 'foo:bar baz');
        });
    });

    describe('.debug()', function () {
        it('should output string "DEBUG: debug message on stderr"', function () {
            util.debug('debug message on stderr');
            assert.equal(stream.lastMessage, 'DEBUG: debug message on stderr\n', stream.lastMessage);
        });
    });

    describe('.error()', function () {
        it('should output string "error message on stderr"', function () {
            util.error('error message on stderr');
            assert.equal(stream.lastMessage, 'error message on stderr\n', stream.lastMessage);
        });
    });

    describe('.puts()', function () {
        it('should output string "puts message on stderr"', function () {
            util.puts('puts message on stderr');
            assert.equal(stream.lastMessage, 'puts message on stderr\n', stream.lastMessage);
        });
    });

    describe('.print()', function () {
        it('should output string "print message on stderr"', function () {
            util.print('print message on stderr');
            assert.equal(stream.lastMessage, 'print message on stderr', stream.lastMessage);
        });
    });

    describe('.log()', function () {
        it('should output string "error message on stderr"', function () {
            util.log('timestamped message');
            assert.equal(stream.lastMessage.indexOf('- timestamped'), 16, stream.lastMessage.indexOf('- timestamped'));
        });
    });

    describe('.inspect()', function () {
        it('should return string', function () {
            var object = {
                    key: 'val',
                    func: function () {
                        this.val = true;
                    }
                },
                test;

            object.func();

            test = util.inspect(object, true, null)

            assert.equal(test.length, 183, test.length);
        });
    });

    describe('.isArray()', function () {
        it('should return true', function () {
            assert.equal(util.isArray([]), true);
        });
        it('should return false', function () {
            assert.equal(util.isArray({}), false);
        });
    });

    describe('.isRegExp()', function () {
        it('should return true', function () {
            assert.equal(util.isRegExp(/some regexp/), true);
        });
        it('should return true', function () {
            assert.equal(util.isRegExp(new RegExp('another regexp')), true);
        });
        it('should return false', function () {
            assert.equal(util.isRegExp({}), false);
        });
    });

    describe('.isDate()', function () {
        it('should return true', function () {
            assert.equal(util.isDate(new Date()), true);
        });
        it('should return false', function () {
            assert.equal(util.isDate(Date()), false);
        });
        it('should return false', function () {
            assert.equal(util.isDate({}), false);
        });
    });

    describe('.isError()', function () {
        it('should return true', function () {
            assert.equal(util.isError(new Error()), true);
        });
        it('should return true', function () {
            assert.equal(util.isError(new TypeError()), true);
        });
        it('should return false', function () {
            assert.equal(util.isError({ name: 'Error', message: 'an error occurred' }), false);
        });
    });
});

//console.log('util.pump() not tested');
//console.log('util.inherits() not tested');

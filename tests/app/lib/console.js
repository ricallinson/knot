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

var console = require('console');
var assert = require('assert');

describe('console', function () {

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

    describe('.log()', function () {
        it('should output string "log"', function () {
            console.log('log');
            assert.equal('log\n', stream.lastMessage, stream.lastMessage);
        });
    });

    describe('.info()', function () {
        it('should output string "info"', function () {
            console.info('info');
            assert.equal('info\n', stream.lastMessage, stream.lastMessage);
        });
    });

    describe('.warn()', function () {
        it('should output string "warn"', function () {
            console.warn('warn');
            assert.equal('warn\n', stream.lastMessage, stream.lastMessage);
        });
    });

    describe('.error()', function () {
        it('should output string "error"', function () {
            console.error('error');
            assert.equal('error\n', stream.lastMessage, stream.lastMessage);
        });
    });

    describe('.dir()', function () {
        it('should output object as string', function () {
            var object = {
                    key: 'val',
                    func: function () {
                        this.val = true;
                    }
                };

            object.func();

            console.dir(object);

            assert.equal(stream.lastMessage.length, 44, stream.lastMessage.length);
        });
    });

    describe('.time()', function () {
        it('should not throw an error', function () {
            console.time('test');
        });
    });

    describe('.timeEnd()', function () {
        it('should output string "0ms"', function () {
            console.time('100-elements');
            for (var i = 0; i < 100; i++) {
              ;
            }
            console.timeEnd('100-elements');

            assert.equal(stream.lastMessage.slice(-3), 'ms\n', stream.lastMessage.slice(-3));
        });
    });

    describe('.trace()', function () {
        it('should output a stack trace', function () {
            console.trace('trace');
            assert.equal(stream.lastMessage.length, 681, stream.lastMessage.length);
        });
    });

    describe('.assert()', function () {
        it('should do nothing', function () {
            console.assert(true);
        });
        it('should throw an error', function () {
            assert.throws(
                function () {
                    console.assert(false);
                },
                Error
            );
        });
    });
});

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

var events = require('events');
var util = require('util');
var assert = require('assert');

describe('events', function () {

    var Eventer = {};

    before(function (done) {

        Eventer = function () {

            events.EventEmitter.call(this);

            this.foo = function () {
                var data = 'baz'
                this.emit('bar', data);
            }

            this.qux = function () {
                this.emit("quux");
            }
        };

        util.inherits(Eventer, events.EventEmitter);

        done();
    });

    describe('addListener', function () {
        it('should trigger addListener with undefined', function () {
            var eventer = new Eventer();
            eventer.addListener('quux', function (e) {
                assert.equal(e, undefined, e);
            });
            eventer.qux();
        });
        it('should trigger addListener with string "baz"', function () {
            var eventer = new Eventer();
            eventer.addListener('bar', function (e) {
                assert.equal(e, 'baz', e);
            });
            eventer.foo();
        });
    });
    
    describe('on', function () {
        it('should trigger on with undefined', function () {
            var eventer = new Eventer();
            eventer.on('quux', function (e) {
                assert.equal(e, undefined, e);
            });
            eventer.qux();
        });
        it('should trigger on with string "baz"', function () {
            var eventer = new Eventer();
            eventer.on('bar', function (e) {
                assert.equal(e, 'baz', e);
            });
            eventer.foo();
        });
    });

    describe('once', function () {
        it('should trigger on with undefined', function () {
            var eventer = new Eventer(),
                count = 0;
            eventer.once('quux', function (e) {
                count = count + 1;
                assert.equal(count, 1, count);
            });
            eventer.qux();
            eventer.qux();
            eventer.qux();
        });
        it('should trigger on with string "baz"', function () {
            var eventer = new Eventer(),
                count = 0;
            eventer.once('bar', function (e) {
                count = count + 1;
                assert.equal(count, 1, count);
            });
            eventer.foo();
            eventer.foo();
            eventer.foo();
        });
    });

    describe('removeListener', function () {
        it('should not throw an error', function () {
            var eventer = new Eventer(),
                callback;

            callback = function(e) {
                throw new Error();
            };

            eventer.on('bar', callback);

            eventer.removeListener('bar', callback);

            eventer.foo();
        });
    });

    describe('removeAllListeners', function () {
        it('should not throw an error', function () {
            var eventer = new Eventer(),
                callback;

            callback = function(e) {
                throw new Error();
            };

            eventer.on('bar', callback);

            eventer.removeAllListeners('bar', callback);

            eventer.foo();
        });
    });

    describe('setMaxListeners', function () {
        it('should not throw an error', function () {
            var eventer = new Eventer(),
                callback;

            callback = function(e) {
                throw new Error('Too many events registered');
            };

            eventer.setMaxListeners(2);

            eventer.on('bar', callback);
            eventer.on('bar', callback);
            eventer.on('bar', callback);
        });
    });

    describe('listeners', function () {
        it('should ', function () {
            var eventer = new Eventer(),
                callback;

            callback = function(e) {
                throw new Error();
            };

            eventer.on('bar', callback);
            eventer.on('bar', callback);
            eventer.on('bar', callback);
            eventer.on('bar', callback);

            assert.equal(eventer.listeners('bar').length, 4, eventer.listeners('bar').length);
        });
    });
});

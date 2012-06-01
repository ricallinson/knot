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

var util = require('util');

console.log(util.format('%s:%s', 'foo', 'bar', 'baz'));  // 'foo:bar baz'
util.debug('debug message on stderr');
util.error('error message on stderr');
util.puts('puts message on stderr');
util.print('print message on stderr');
util.log('Timestamped message.');
console.log(util.inspect(util, true, null));

console.log(util.isArray([])); // true
console.log(util.isArray({})); // false

console.log(util.isRegExp(/some regexp/));// true
console.log(util.isRegExp(new RegExp('another regexp')));// true
console.log(util.isRegExp({})); // false

console.log(util.isDate(new Date()));// true
console.log(util.isDate(Date()));// false (without 'new' returns a String)
console.log(util.isDate({}));// false

console.log(util.isError(new Error()));// true
console.log(util.isError(new TypeError()));// true
console.log(util.isError({ name: 'Error', message: 'an error occurred' }));// false

console.log('util.pump() not tested');
console.log('util.inherits() not tested');

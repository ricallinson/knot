
var util = require('util');

console.log(util.format('%s:%s', 'foo', 'bar', 'baz'));  // 'foo:bar baz'
util.debug('debug message on stderr');
util.error('error message on stderr');
util.puts('puts message on stderr');
util.print('print message on stderr');
util.log('Timestamped message.');
console.log(util.inspect(util, true, null));

console.log(util.isArray([])); // true
console.log(util.isArray(new Array())); // true
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
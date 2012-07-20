# Knot Node

[![Build Status](https://secure.travis-ci.org/capecodehq/knot.png?branch=master)](http://travis-ci.org/capecodehq/knot)

A programmatic folly exploring the underbelly of implementing a client-side version of Node.

## Exmaple Usage

    <script type="text/javascript" src="/knot/process.js"></script>
    <script type="text/javascript">
        process(function(exports, require, module) {
            var util = require('util');
            console.log(util.inspect(this, true, 6));
        });
    </script>

## Supported Modules & Functions

### Globals

* process
* console
* require()
* __filename
* __dirname
* module
* exports
* setTimeout(cb, ms)
* clearTimeout(t)
* setInterval(cb, ms)
* clearInterval(t)

### Process

* process.stdout
* process.stderr
* process.execPath
* process.cwd()
* process.version
* process.versions
* process.installPrefix
* process.arch
* process.platform
* process.uptime()

### Console

* console.log()
* console.info()
* console.warn()
* console.error()
* console.dir(obj)
* console.time(label)
* console.timeEnd(label)

### Utils

* util.format()
* util.debug(string)
* util.log(string)
* util.inspect(object, [showHidden], [depth], [colors])
* util.isArray(object)
* util.isRegExp(object)
* util.isDate(object)
* util.isError(object)
* (not tested) util.pump(readableStream, writableStream, [callback])
* (not tested) util.inherits(constructor, superConstructor)

### Events

Note: Not tested yet.

* emitter.addListener(event, listener)
* emitter.on(event, listener)
* emitter.once(event, listener)
* emitter.removeListener(event, listener)
* emitter.removeAllListeners([event])
* emitter.setMaxListeners(n)
* emitter.listeners(event)
* emitter.emit(event, [arg1], [arg2], [...])

### Buffer

Notes: process.binding('buffer').SlowBuffer.

* (check support) SlowBuffer

### Path

* path.normalize(p)
* path.join([path1], [path2], [...])
* path.resolve([from ...], to)
* path.relative(from, to)
* path.dirname(p)
* path.basename(p, [ext])
* path.extname(p)

### URL

* url.parse(urlStr, [parseQueryString], [slashesDenoteHost])
* url.format(urlObj)
* url.resolve(from, to)

### Query Strings

Note: Not fully tested yet. Commented out "process.binding('http_parser').urlDecode" to make it work.

* querystring.stringify(obj, [sep], [eq])
* querystring.parse(str, [sep], [eq])
* querystring.escape
* querystring.unescape

### Assertion Testing

* assert.fail(actual, expected, message, operator)
* assert(value, message), assert.ok(value, [message])
* assert.equal(actual, expected, [message])
* assert.notEqual(actual, expected, [message])
* (not tested) assert.deepEqual(actual, expected, [message])
* (not tested) assert.notDeepEqual(actual, expected, [message])
* assert.strictEqual(actual, expected, [message])
* assert.notStrictEqual(actual, expected, [message])
* assert.throws(block, [error], [message])
* assert.doesNotThrow(block, [error], [message])
* assert.ifError(value)

## Modules Not Supported

* Crypto
* File System
* Net
* UDP/Datagram
* DNS
* Stream
* HTTP
* HTTPS
* Readline
* REPL
* VM
* Child Processes
* TTY
* ZLIB
* OS
* Debugger
* Cluster

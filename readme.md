# Knot Node

A programmatic folly exploring the underbelly of implementing a client-side version of Node.

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

Note: Uses process.binding().

### Stream

Note: Not tested yet.

* all.functions

### Path

* path.normalize(p)
* path.join([path1], [path2], [...])
* path.resolve([from ...], to)
* path.relative(from, to)
* path.dirname(p)
* path.basename(p, [ext])
* path.extname(p)

### URL

Note: Requires "Query Strings".

### Query Strings

Note: Uses process.binding().

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

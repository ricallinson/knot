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
* process.stdin
* process.execPath
* process.cwd()
* process.env
* process.version
* process.versions
* process.installPrefix
* process.arch
* process.platform
* process.uptime()

### Console

Note: These have not been fully tested yet.

* console.log()
* console.info()
* console.warn()
* console.error()
* console.dir(obj)
* console.time(label)
* console.timeEnd(label)

### Utils

Note: These have not been fully tested yet.

* util.format()
* util.debug(string)
* util.log(string)
* util.inspect(object, [showHidden], [depth], [colors])
* util.isArray(object)
* util.isRegExp(object)
* util.isDate(object)
* util.isError(object)
* util.pump(readableStream, writableStream, [callback])
* util.inherits(constructor, superConstructor)

### Path

Note: These have not been fully tested yet.

* path.normalize(p)
* path.join([path1], [path2], [...])
* path.resolve([from ...], to)
* path.relative(from, to)
* path.dirname(p)
* path.basename(p, [ext])
* path.extname(p)

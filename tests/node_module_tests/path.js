
var path = require('path');

console.log(path.normalize('/foo/bar//baz/asdf/quux/..')); // /foo/bar/baz/asdf
console.log(path.join('/foo', 'bar', 'baz/asdf', 'quux', '..')); // /foo/bar/baz/asdf
console.log(path.join('foo', {}, 'bar')); // foo/bar
console.log(path.resolve('/foo/bar', './baz')); // /foo/bar/baz
console.log(path.resolve('/foo/bar', '/tmp/file/')); // /tmp/file
console.log(path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif')); // '/wwwroot/static_files/gif/image.gif'
console.log(path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb')); // ../../impl/bbb
console.log(path.dirname('/foo/bar/baz/asdf/quux')); // /foo/bar/baz/asdf
console.log(path.basename('/foo/bar/baz/asdf/quux.html')); // quux.html
console.log(path.basename('/foo/bar/baz/asdf/quux.html', '.html')); // quux
console.log(path.extname('index.html')); // .html
console.log(path.extname('index.')); // .
console.log(path.extname('index'));// ''
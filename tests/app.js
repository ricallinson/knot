
/* 
 * Load required modules
 */

var connect = require('connect'),
    knot = require('../'),
    app = connect.createServer();

/*
 * Tell connect to use the knot middleware.
 */

app.use(knot.node(process.cwd()));

/*
 * Add a simple function to serve the index.html file
 */

app.use(function(req, res){
    res.end(require('fs').readFileSync('./views/index.html'));
});

/*
 * Listen for requests on http://localhost:3000/
 */

app.listen(3000);

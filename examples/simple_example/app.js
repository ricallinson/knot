
/* 
 * Load modules
 */

var express = require('express'),
    stache = require('stache'),
    knot = require('knot'),
    app = express.createServer();

/*
 * Tell express to use the knot middleware.
 */

app.use(knot.node(process.cwd()));

/*
 * Register mustache for .html
 */

app.register('.html', stache);
app.set('view options', {
    layout: false
});

/*
 * Add a simple route to our flat file
 */

app.get('/', function(req, res){
    res.render('index.html');
});

/*
 * Listen for requests on http://localhost:3000/
 */

app.listen(3000);

var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);
var anyDB = require('any-db');
var conn = anyDB.createConnection('sqlite3://database.db');

var engine = require('consolidate');

app.engine('html', engines.hogan); // tell Express to run .html files through Hogan
app.set('views', __dirname + '/templates'); // tell Express where to find templates
app.use(express.static('public'));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.use(express.static(__dirname + '/views'));
app.engine('html', engine.mustache);
app.set('view engine', 'html');

app.get('*', function(request, response) {
    response.render('index.html');
});



server.listen(8080, function(){
    console.log('- Server listening on port 8080');
});
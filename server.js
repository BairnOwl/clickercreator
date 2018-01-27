var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);

var engine = require('consolidate');

var bodyParser = require('body-parser');
app.use(bodyParser.json())

app.use(express.static(__dirname + '/views'));
app.engine('html', engine.mustache);
app.set('view engine', 'html');

app.get('*', function(request, response){
    response.render('index.html');
});

server.listen(8080, function(){
    console.log('- Server listening on port 8080');
});
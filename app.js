var express = require('express');
var http = require('http');
var path = require('path');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var bodyParser = require('body-parser');
var logger = require('morgan');

/*
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('Hello World!');
}).listen(8080); 

*/

var db = require('./db');
var port = 8080;
var app = express();
var routes = require('./routes/routes.js')(app);
app.set('view engine', 'ejs');

var storage = new MySQLStore(db.con);
app.use(express.static(path.join(__dirname, 'views')));
app.set('views', __dirname + '/views');
app.use(logger('dev'));
app.use(bodyParser.json);
app.use(bodyParser.urlencoded());
//app.use(app.router);

module.exports = app;

var server = app.listen(process.env.PORT || 8080, listen);

function listen() {
	//var host = "ec2-18-216-244-127.us-east-2.compute.amazonaws.com";
	//var port = "8080";
	
	//app.listen(host, port);
	console.log("Listening at http://ec2-18-216-244-127.us-east-2.compute.amazonaws.com");

}
console.log("Listening on port 8080");
app.use(express.static('public'));




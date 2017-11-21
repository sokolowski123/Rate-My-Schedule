module.exports = function(app) {
	var db = require('../db');
	var bodyParser = require('body-parser');
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended: true }));
	console.log("outside!");
	app.get('/', function(req, res) {
		console.log("Go to main!");
		res.render('../views/main.ejs');
	});


}

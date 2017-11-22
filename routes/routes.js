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

	app.get('/view_schedule', function(req, res) {
		console.log("Viewing the user schedule");
		res.render('../views/view_scheulde.ejs');
	});

	app.get( '/write_review', function(req, res) {
		console.log("Go to review");
		res.render('../views/write_review.ejs');
	});

}

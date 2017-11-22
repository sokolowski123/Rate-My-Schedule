module.exports = function(app) {
	var db = require('../db');
	var bodyParser = require('body-parser');
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended: true }));
	console.log("outside!");
	
	var obj = {};
	app.get('/', function(req, res) {
		console.log("Go to main!");
		//res.render('../views/main.ejs');
		db.query('SELECT * FROM review', function(err, result) {
			if (err) {
				console.log(err);
			}
			else {
				for (x in result) {
					console.log(result[x]);
				}
				var rows = result;
				res.render('../views/main.ejs', {rows: rows});

			}
		});
	});

	app.get('/view_schedule', function(req, res) {
		console.log("Viewing the user schedule");
		res.render('../views/view_schedule.ejs');
	});

	app.get( '/write_review', function(req, res) {
		console.log("Go to review");
		res.render('../views/write_review.ejs');
	});

}

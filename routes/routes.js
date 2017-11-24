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
		db.query('SELECT number, name, professor FROM classes', function(err, result) {
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
		
	/*
	app.post('post_review', function(req, res) {
		console.log("woooo");
		var classname = req.query.classname;
		var title = req.query.title;
		var prof = req.query.prof;
		var score = req.query.score;
		var desc = req.query.desc;
		var query = "insert into review (class, title, prof, score, description) values ('" + classname + "', '" + title + "', '" + prof + "', '" + score + "', '" + desc + "')";
		console.log("query: " + query);
		db.query(query, function(err, res) {
			if (err) {
				throw err;
			} else {
				console.log("Added review to db");
				res.status(200).json({status: "ok"});
			}				
		}); 
	});
	*/
	app.post('/sendreview', function(req, res) {
		console.log("woooo");
                var classname = req.query.classname.toUpperCase();
                var title = req.query.title;
                var prof = req.query.prof;
                var score = req.query.score;
                var desc = req.query.desc;
                var query = "insert into review (class, title, prof, score, description) values ('" + classname + "', '" + title + "', '" + prof + "', '" + score + "', '" + desc + "')";
                console.log("query: " + query);
		db.query(query, function(err, result) {
			if (err) {
				console.log("Error with query");
			} else {
				console.log("Added review to db");
				res.status(200).json({status: "ok"});
			}
		});
	});

}

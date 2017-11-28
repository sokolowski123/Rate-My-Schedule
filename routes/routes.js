module.exports = function(app) {
	var db = require('../db');
	var bodyParser = require('body-parser');
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended: true }));
	console.log("outside!");
	
	var obj = {};
	app.get('/', function(req, res) {
		console.log("Go to main!");
		res.render('../views/main.ejs');
		/*db.query('SELECT number, name, professor FROM classes', function(err, result) {
			if (err) {
				console.log(err);
			}
			else {
				for (x in result) {
					console.log(result[x]);
				}
				var rows = JSON.stringify(result);
				res.render('../views/main.ejs', {rows: rows});

			}
		});*/
	});
	app.get('/get-classes', function(req, res) {
		console.log("got the request");
		db.query('SELECT number, name, professor FROM classes', function(err, result) {
			if (err) {
				console.log(err);
			}
			else {
      			res.json(result);
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
		
	app.post('/sendreview', function(req, res) {
                var classname = req.query.classname.toUpperCase();
                var title = req.query.title;
                var prof = req.query.prof;
                var score = req.query.score;
                var desc = req.query.desc;
                var query = "insert into review (class, title, prof, score, description) values ('" + classname + "', '" + title + "', '" + prof + "', '" + score + "', '" + desc + "')";
                var query2 = "select * from classes where number='" + classname + "'";
		var query3 = "insert into classes (number, name, professor) values ('" + classname + "', \"\", \"\")";
		
		db.query(query2, function(err, result) {
			if (result[0] == undefined) {
				db.query(query3, function(err, result) {
					if (err) {
						console.log("error!");
					} else {
						console.log("Class added!");
					}
				});
			}			
		});
		
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

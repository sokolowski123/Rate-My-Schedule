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

	app.get('/view_class', function(req, res) {
		console.log("Viewing the selected class");
		var number = req.query.number;
		var name  = req.query.name;
		var prof = req.query.professor;
		console.log("num " + number);
		console.log("name " + name);
		console.log("prof " + prof);

		var sql = "SELECT cid FROM classes WHERE number=?";

		db.query(sql, number, function(err, result) {
			if (err) {
				console.log(err);
			}
			else {
				var cid = result[0].cid
				console.log("result " + cid);
				res.render('../views/view_class.ejs', {classId: cid});
			}
		});
		//res.render('../views/view_class.ejs', {classId: cid});
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

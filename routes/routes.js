module.exports = function(app) {
	var db = require('../db');
	var bodyParser = require('body-parser');
	var passhash = require('bcryptjs');
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended: true }));
	console.log("outside!");
	
	var obj = {};
	app.get('/main', function(req, res) {
		console.log("going to maaain");
		res.render("../views/main.ejs");
	});

	app.get('/', function(req, res) {
		console.log("Go to main!");
		res.render('../views/login.ejs');
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
	app.get('/createAccount', function(req, res) {
		res.render("../views/createAccount.ejs");
	})
	/*
	app.get('/main', function(req, res) {
		res.render("../views/main.ejs?user");
	});
*/
	app.get('/adduser/:user/:pass', function(req, res) {
		var user = req.params.user;
		var pass = req.params.pass;

		var salt = passhash.genSaltSync(10);		
	
		var query = "select * from users where username='" + user + "'";
		var hashedpass = passhash.hashSync(pass, salt);
		
		console.log("hashed1: " + hashedpass);
		var query2 = "insert into users (username, password) values ('" + user + "', '" + hashedpass + "')";

		db.query(query, function(err, result) {
			if (result[0] != undefined) {
				res.status(500).send({error: "User already exists!"});
			} else {
				db.query(query2, function(err, result) {
					if (err) {
						throw err;
					} else {
						res.render("../views/main.ejs");
					}
				});
			}
		});
	});
	
	app.get('/login/:user/:pass', function(req, res) {
		var user = req.params.user;
		var pass = req.params.pass;

		

		//var hashedpass = passhash.hash(pass, 10);
		//var hashedpass = passhash.generate(pass);
		//console.log("hashed: " + passhash.hash(pass, 10));
		var query = "select * from users where username='" + user + "'";
		//var query2 = "insert into users (username, passsword) values ('" + user + "', '" + hash + "')"; 
		db.query(query, function(err, result) {
			if (result[0] == undefined) {
				//throw new Error("user does not exist!");
				res.status(500).send({error: "User does not exist!"});	
			} else {
				console.log("db: " + passhash.compareSync(pass, result[0].password));
				if (passhash.compareSync(pass, result[0].password)) {
					res.status(200).send({ok: "valid user info"});
				} else {
					res.status(500).send({error: "Invalid user login info!"});
				}
			}
		});
		
	});

	app.get('/get-cid', function(req, res) {
		console.log("get cid");
		var number = req.query.number;
		var name = req.query.name;
		var prof = req.query.professor;
		console.log(number);
		console.log(name);
		console.log(prof);
		var query = "SELECT cid FROM classes WHERE number='" + number + "' AND name='" + name + "' AND professor='" + prof + "'";
		console.log(query);

		db.query(query, function(err, result) {
			res.json(result);
		});
	});

	app.get('/get-score', function(req, res) {
		var cid = req.query.cid;
		var query = "SELECT AVG(score) AS avg FROM reviews WHERE class_id='" + cid + "'";
		db.query(query, function(err, result) {
			res.json(result);
		});
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
				var cid = result[0].cid;
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
                var classname = req.query.classname.toLowerCase();
                var title = req.query.title;
                var prof = req.query.prof;
                var score = req.query.score;
                var desc = req.query.desc;
                var query = "insert into review (class, title, prof, score, description) values ('" + classname + "', '" + title + "', '" + prof + "', '" + score + "', '" + desc + "')";
                var query2 = "select * from classes where number='" + classname + "'";
				var query3 = "insert into classes (number, name, professor) values ('" + classname + "', \"\", \"\")";

				var newQuery = "SELECT cid FROM classes WHERE number='" + classname + "' AND professor='" + prof + "'";
				console.log(newQuery);
				db.query(newQuery, function(err, result) {
					if (result[0] == undefined) {
						console.log("class doesn't exist");
						var queryCreate = "INSERT INTO classes(number, name, professor) VALUES ('" + classname + "', \"\", '" + prof + "')";
						console.log("querycreate " + queryCreate);
						db.query(queryCreate, function(err, result) {
							if (err) {
								throw err;
							}			
							else {
								console.log("class added successfully");
								db.query(newQuery, function(err, result) {
									if (result[0] == undefined) {
										console.log("class still doesn't exist");
									}
									else {
										console.log("have class after inserting");
										var cid = result[0].cid;
										var queryReview = "INSERT INTO reviews(class_id, title, score, description) VALUES('" + cid + "', '" + title + "', '" + score + "', '" + desc + "')";
										console.log( "queryReviw " + queryReview );
										db.query(queryReview, function(err, result) {
											if (err) {
												throw err;
											}
											else {
												console.log("added review");
												res.status(200).send({ok: "added review"});
											}
										});
									}

								});
							}
						});
					}
					else {
						var cid = result[0].cid;
						var queryReview = "INSERT INTO reviews(class_id, title, score, description) VALUES('" + cid + "', '" + title + "', '" + score + "', '" + desc + "')";
						console.log( "queryReviw " + queryReview );
						db.query(queryReview, function(err, result) {
							if (err) {
								throw err;
							}
							else {
								console.log("added review");
								res.status(200).send({ok: "added review"});
							}
						});
					}
				});
		
		/*db.query(query2, function(err, result) {
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
		});*/
	});

}

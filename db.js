var mysql = require('mysql');

var con = mysql.createConnection({
	host: "rmsdb.c6ksrgljhkqt.us-east-2.rds.amazonaws.com",
	user: "admin252",
	password: "sokool123",
	database: "rmsdb" 
});

con.connect(function(err, data)
{
    if (err)
    {
        console.log("error connection to db");
        throw err;
    }
    else
    {
        console.log("success connection to db");
        //console.log(data);
        //var rows = JSON.stringify(data);
        //console.log(rows);
    }
});

module.exports = con;


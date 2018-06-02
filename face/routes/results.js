var express 	= require('express'),
router 		= express.Router(),
db 			= require('../db_connect');

function queryResults(query, res) {
	db.query(query, 
		function (err, result)  {
			if(err){
				throw err;
			} else {
				var objs = [];
				for (var i = 0;i < result.length; i++) {
					objs.push(result[i]);
				}
				res.end(JSON.stringify(objs));            
			}
		});
}

router.get('/attr', function(req, res) {
	queryResults("SELECT `COLUMN_NAME` FROM `INFORMATION_SCHEMA`.`COLUMNS` WHERE `TABLE_SCHEMA`='face' AND `TABLE_NAME`='face' LIMIT 1,1000;", res);
});

router.post('/get', function(req, res) {
	var obj = req.body.data;
	//console.log(obj);
	var query = "SELECT Path, " + obj + " FROM face;";
	console.log(query);
	queryResults(query, res);
	//res.end();
});


//UPDATE table_name
//SET column1 = value1, column2 = value2, ...
//WHERE condition;




router.post('/update', function (req, res) {
	var obj = req.body;
	var attr = obj[0];
	var toNo = obj[1];
	var toYes = obj[2];
	var query = "";
	//console.log(attr);
	//console.log(val);
	//console.log(ids);
	//console.log('\ntoNo:\n');
	for(var i = 0; i < toNo.length; i++) {
		query = "UPDATE face SET " + attr + " = 0 WHERE Path = '" + toNo[i] + "';";
		//console.log(query);
		queryResults(query, res);
	}
	//console.log('\ntoYes:\n');
	for(var i = 0; i < toYes.length; i++) {
		query = "UPDATE face SET " + attr + " = 1 WHERE Path = '" + toYes[i] + "';";
		//console.log(query);
		queryResults(query, res);
	}
	//var query = "SELECT " + attr + " FROM face WHERE Path = '" + toNo + "';";
	//console.log(query);

	res.end();
});

module.exports = router;
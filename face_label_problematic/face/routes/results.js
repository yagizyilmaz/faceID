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

module.exports = router;
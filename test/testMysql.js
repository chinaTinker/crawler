var mysqlHelper = require('../helper/mysqlHelper.js');

mysqlHelper.pool.getConnection(function(err, conn){
	if(err) return console.log(err);

	conn.query(
		"insert into link(url) value(?)", 

		["http://local.me/discuss/23423"],

		function(err, result){
			console.log(result);
			conn.release();
		}
	)

	;
});


mysqlHelper.execute("select * from link", function(err, rows){
	if(err) return console.log(err)

	for(var i = 0, len = rows.length; i < len; i++) {
		console.log(rows[i]);
	}

});
var mysql = require('mysql');
var config = require('../conf/config.json');

/**
 *  mysql helper
 *  grud operations
 *  
 *  Tinker 2014-5-14
 */
var mysqlHelper = module.exports = {};

mysqlHelper.pool = mysql.createPool({
	host:     config.mysql.host,
	port:     config.mysql.port,
	database: config.mysql.database,
	user:     config.mysql.user,
	password: config.mysql.password,
	connectionLimit: 10
});

mysqlHelper.execute = function(sql, callback) {
	mysqlHelper.pool.getConnection(function(err, connection){
		if(err) return console.log(err);

		connection.query(sql, function(err, rows){
			callback(err, rows);

			connection.release();
		});
	});
};



/**
 *  tinker 2014-4-25
 *   
 *  reids client wrapper  
 */
var config = require('../conf/config.json');
var redis = require("redis");

var RedisClient = function() {
	this.client = redis.createClient(config.redis.port, config.redis.host);
};

RedisClient.prototype.set = function(key, message) {
	this.client.set(key, message);
};

RedisClient.prototype.get = function(key, callback) {
	if(key != null) {
		this.client.get(key, callback);
	}
};

RedisClient.prototype.close = function() {
	this.client.end();
};

module.exports = RedisClient;


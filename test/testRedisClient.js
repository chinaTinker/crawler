var Client = require('../helper/redisClient.js');

var key = 'key-1111';
var val = 'hello world';
var client = new Client();

client.set(key, val);

client.get(key, function(err, reply){
	if(err){
		console.log('something error ' + err);
	} else {
		console.log(reply);
	}

	client.close();
});
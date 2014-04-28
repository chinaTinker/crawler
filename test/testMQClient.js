var MQHelper = require('../helper/mqClientHelper.js');

var client = MQHelper.getClient();

var doTest = function(){

	for(var i = 0; i < 100; i++) {
		var message = {
			"words": "hello world - " + i
		};

		client.publish(message);
	}

	client.subscribe(function(message) {
		console.log(message);
	});

	client.close();
};

doTest();



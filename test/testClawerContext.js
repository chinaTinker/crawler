var ClawRequest = require('../clawer/ClawRequest.js');
var Context = require('../clawer/ClawerContext.js');
var urlParser = require('urlparser');

var clawerHelper = {
	buildHttpOptions: function(task) {
		return {
			host: task.url,
			port: 80,
			path: '/'
		}
	}, 

	parseData: function(data) {
		//console.log(data);
	}
};


var clawerContext = new Context(clawerHelper);

clawerContext.on('over', function() {
	console.log("finished");
});

var clawRequest = new ClawRequest(1, 'hello', 8119);
clawerContext.addRequest(clawRequest);
clawerContext.fire();





var Clawer = require('../clawer/clawer.js');
var simpleParser = require("../parser/simpleParser.js");

var opts = {
	hostname: 'www.kanchufang.com',
	port: 80,
	path: '/',
	method: 'GET'
};

var clawer = new Clawer(opts);

clawer.on('ready', simpleParser.parse);
clawer.on('error', function(e) {
	console.log('request error', e);
});

clawer.on('moreLinks', function(links) {
	console.log(links);
});

clawer.fetch();

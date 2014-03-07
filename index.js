/*
 * spider main index
 * 
 * Tinker 2014-3-6
 */
var config       = require("./conf/config.json");
var clawer       = require("./clawer/clawer.js");
var simpleParser = require("./parser/simpleParser.js");
var cache        = require("./helper/cache.js");

console.log(config.urls);
console.log("max depth = " + config.depth);

var toFetchUrls = config.urls;

if(!!toFetchUrls && toFetchUrls.length > 0){

	clawer.addParser(simpleParser.parse);

	for(var i = 0, len = toFetchUrls.length; i < len; i++){
		clawer.fetch(toFetchUrls[i]);
	}

}else {
	console.warn("no urls configed!");
}

//check the state when exit
process.on('exit', function(code){
	setTimeout(function(){
		console.log("total " + cache.length + " urls parsed");
	}, 1000);
});



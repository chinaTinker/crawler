/*
* web clawer
*
* Tinker 2014-3-6 
*/
var client      = require("http");
var urlParser   = require("url");
var config      = require("../conf/config.json");
var linkParser  = require("../parser/achorParser.js");
var Buffer      = require('buffer').Buffer;
var iconv 			= require('iconv-lite');
var BufferHelper = require('bufferhelper');
var urlencode   = require('urlencode');

var clawer = {
	maxDepth:       config.depth || 3,
	startDepth:     0,
	charset: 			  config.charset || "utf8",
	contentParsers: []
};

/* web data fetch operation */
clawer.fetch = function(url, depth) {
	var crrDepth = depth || 1;

	if(this.maxDepth < crrDepth){
		return false;
	}
	
	//TODO	
	var actualUrl = url + '&kw=' + urlencode('肺癌', 'GBK');
	console.log(actualUrl);

	var request = client.get(actualUrl, function(res){
		var bufferhelper = new BufferHelper();

		res.on('data', function(chuck) {
			bufferhelper.concat(chuck);
		});

		res.on('end', function() {
			var data = iconv.decode(bufferhelper.toBuffer(), 'GBK');
			clawer.doParse(data);
		});

		res.on('end', function(){
			var data = iconv.decode(bufferhelper.toBuffer(), 'GBK');
			linkParser.parse(data, depth, clawer.fetch);
		});

	});

	request.on("error", function(e){
		console.error(e.message);
	});

};

/**
 * use the parsers chains to parse the content
 */
clawer.doParse = function(data) {
	if(data && data.length > 0){
		for(var i = 0, len = clawer.contentParsers.length; i < len; i++){
			clawer.contentParsers[i](data);
		}
	}
};

clawer.addParser = function(parser){
	clawer.contentParsers.push(parser);
};

clawer.requestOptions = function(url){
	var opts = urlParser.parse(url);

	return {
		"hostname": opts.host,
		"port":   80,
		"method": "get",
		"path":   opts.path,
		"header": {
			"scheme":  "https",
			"version": "HTTP/1.1",
			"accept":  "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
			"accept-encoding": "gzip,deflate,sdch",
			"accept-language": "zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4",
			"User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1871.0 Safari/537.36"
		}
	}
}

module.exports = clawer;

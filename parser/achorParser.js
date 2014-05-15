/*
 * parse the html, and get the achor links
 * 
 * TODO --> need a more effective algorithm
 * 
 * Tinker 2014-3-6
 */

var htmlParser = require("htmlparser2");
var urlHelper  = require("../helper/urlHelper.js");
var cache      = require("../helper/cache.js");

var achorParser = {};

achorParser.parse = function(html, depth){
	var urls = [];

	if(!!html && html != ""){
		var parser = new htmlParser.Parser({

			onopentag: function(tagName, attrs){
				if(tagName === "a" && urlHelper.isValidUrl(attrs.href)){
					var crrurl = attrs.href;
					//cache.add(crrurl);
					urls.push(crrurl);
				} 
			}
		});

		parser.write(html);
		parser.end();
	}else {
		console.log("achorParser: html is null");
	}

	return urls;
};



module.exports = achorParser;

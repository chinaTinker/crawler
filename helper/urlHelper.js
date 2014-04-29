/**
 * url check helper
 */
var cache      = require("./cache.js");

var urlHelper = {};

/**
 * check the url it is valid or not
 */
urlHelper.isValidUrl = function(url) {
	if(!url || url.length < 2 ){
		return false;
	}
	
	return !this.isIgnore(url) && !this.isExisted(url);
};

/** check if need ignore */
urlHelper.isIgnore = function(url){
	var ignoreWords = ["https", "javascript", "mailto"];

	for(var i = 0, len = ignoreWords.length; i < len; i++){
		var crrKeyWord = ignoreWords[i];

		if(url.substring(0, crrKeyWord.length) === crrKeyWord){
			return true;
		}
	}

	return false;
};

/**
 * check if the url has been caught
 * 1. check the memory cache
 * 2. if step.1 is failed ,check db 
 */
urlHelper.isExisted = function(url){
	return this.isInCache(url) || this.isInDB(url);
};

/** check the url if it has setted in cache(array: links) */
urlHelper.isInCache = function(url){
	return cache.isExited(url)
};

/** check if the url has saved in db */
urlHelper.isInDB = function(url) {
	
	//TODO

	return false;
};

module.exports = urlHelper;
/**
 * cache, mainly keep the urls parsed
 * 
 * FIXME, use more effective algrithm 
 *
 * Tinker 2014-3-6
 */
var cache = [];

cache.add = function(url){
	this.push[url];
};

cache.isExited = function(url){
	for(var i = 0, len = this.length; i < len; i++){
		if(this[i] === url) return true;
	}

	return false;
};

module.exports = cache;

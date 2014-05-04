/**
 *  Crawle Request Entity, 
 *  wrapped the count, words, categarory informations
 * 
 *  Tinker
 *  2014-4-25
 */
var uuid = require('node-uuid');
var config = require('../conf/config.json');
var MQHelper = require('../helper/mqClientHelper.js');
var mqClient = MQHelper.getClient();

var ClawRequest = function(count, depth, words, categarory) {
	this.count = count;
	this.depth = depth;
	this.words = words;
	this.categarory = categarory;
	this.requestId = uuid.v1();
};

/**
 * parse the request to job tasks
 */
ClawRequest.prototype.generateTasks = function() {
	var tasks = [];
	for(var i = 0, len = config.urls.length; i < len; i++) {
		var crrUrl = config.urls[i];

		tasks.push({
			requestId:  this.requestId,
			url:         crrUrl,
			words:       this.words,
			targetCount: this.count,
			crrCount:    0,
			targetDepth: this.depth,
			depth:       0,
			categarory:  this.categarory
		});
	}

	return tasks;
};

module.exports = ClawRequest;
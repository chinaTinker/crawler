/**
 *  Crawle Request Entity, 
 *  wrapped the count, words, categarory informations
 * 
 *  Tinker
 *  2014-4-25
 */

var config = require('../conf/config.json');
var MQClinet = require('../helper/mqClient.js');
var mqClient = new MQClient();

var CrawleRequest = function(count, words, categarory) {
	this.count = count;
	this.words = words;
	this.categarory = categarory;
};

/**
 * parse the request to job tasks
 */
CrawleRequest.prototype.generateTasks = function() {
	for(var i = 0, len = config.urls.length; i < len; i++) {
		var crrUrl = config.urls[i];

		/*
		 * if the crrCount >= targetCount
		 * this task will be oblished
		 */
		var subTask = {
			url:         crrUrl,
			words:       this.words,
			targetCount: this.count,
			crrCount:    0,
			depth:       0,
			categarory:  this.categarory
		};

		mqClient.publish(subTask);
	}
};

module.exports = CrawleRequest;
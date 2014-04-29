/**
 * the every claw request will run in a
 * context, for keeping the infos and
 * giving a hand to checker
 *
 *  Tinker 2014-4-29
 */
var util     = require('util');
var events   = require('events');
var mqHelper = require('../helper/mqClientHelper.js');
var mqClient = mqHelper.getClient();

var ClawerContext = module.exports = function ClawerContext() {
	events.EventEmitter.call(this);
};
util.inherits(ClawerContext, events.EventEmitter);


ClawerContext.prototype.fire = function() {
	mqClient.subscribe(this.dealTask);

	console.log('engin ready on');
};

ClawerContext.prototype._dealTask = function(task) {
	//TODO
	console.log(task);
};




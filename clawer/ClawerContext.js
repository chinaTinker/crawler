/**
 * the every claw request will run in a
 * context, for keeping the infos and
 * giving a hand to checker
 *
 *  Tinker 2014-4-29
 */
var util     = require('util');
var events   = require('events');
var ClawRequest = require('./ClawRequest.js');
var Clawer   = require('./clawer.js');
var Q        = require('q');

var ClawerContext = module.exports = function ClawerContext(clawerHelper) {
	this.clawerHelper = clawerHelper;
	this.requests = [];

	events.EventEmitter.call(this);
};
util.inherits(ClawerContext, events.EventEmitter);

ClawerContext.prototype.addRequest = function(request) {
	if(request instanceof ClawRequest) {
		var tasks = request.generateTasks();
		for(var i = 0, len = tasks.length; i < len; i++) {
			this.requests.push(tasks[i]);
		}
	}
};

ClawerContext.prototype.fire = function() {
	this.on('ok',   this._fireOne);
	this.on('fire', this._dealTask);

	this._fireOne();
};

ClawerContext.prototype._fireOne = function() {
	if(this.requests && this.requests.length > 0) {
		this.emit('fire', this.requests.pop());
	} else {
		this.emit('over');
	}
};

ClawerContext.prototype._dealTask = function(task) {
	var _this = this;

	var deffered = Q.defer();
	var linkDeff = Q.defer();

	var httpOpts = this.clawerHelper.buildHttpOptions(task);	
	var clawer = new Clawer(httpOpts);
	
	clawer.on('ready', function(data) {
		deffered.resolve(data);
	});

	clawer.on('moreLinks', function(links) {
		linkDeff.resolve(links);
	});

	clawer.on('error', function(e) {
		deffered.reject(e);
	});

	clawer.fetch();

	Q.all([deffered.promise, linkDeff.promise])
	 .done(function(resolved) {
	   if(resolved && resolved.length > 0) {
	     var data = resolved[0];
	     _this._dealData(data);
	     _this.clawerHelper.parseData(data);

	     if(resolved.length > 1) {
	     	 var links = resolved[1];
	     	 _this._dealLinks(links);
	     }
	   }
	 });

	this.emit('ok');
};

/** save the data into db */
ClawerContext.prototype._dealData = function(data) {
	//TODO
}

/**
 * need check if there are enough data 
 * or the depth has reached at depest position
 * or other abort condiiton works
 * 
 * and then, update the task
 */
ClawerContext.prototype._dealLinks = function(links) {
	console.log(links);
	//TODO
}


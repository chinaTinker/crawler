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
	this.currentTask = null;

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
		if(!this._updateCurrentTask(this.requests.pop())) {
			this.emit('fire', this.currentTask);
		} else {
			this.emit('ok');
		}
	} else {
		this.emit('over');
	}
};

ClawerContext.prototype._dealTask = function(task) {
	console.log('now, I will claw page: ' + task.url);

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
	 .then(function(resolved) {
	   if(resolved && resolved.length > 0) {
	     _this.currentTask.count++;

	     var data = resolved[0];
	     _this._dealData(data);
	     _this.clawerHelper.parseData(data);

	     if(resolved.length > 1) {
	     	 var links = resolved[1];
	     	 _this._dealLinks(links);
	     }
	   }
	 }).done(function() {
	 		_this.emit('ok');
	 });
};

/** save the data into db */
ClawerContext.prototype._dealData = function(data) {
	//TODO
	console.log('ok!  ok! I will save data into redis!!');
};

/**
 * need check if there are enough data 
 * or the depth has reached at depest position
 * or other abort condiiton works
 * 
 * and then, update the task
 */
ClawerContext.prototype._dealLinks = function(links) {
	if(links && links.length > 0) {
		for(var i = 0, len = links.length; i < len; i++) {
			var crrlink = links[i];
			if(this.clawerHelper.isFollow(crrlink)) {
				var newTask = {};
				newTask.url         = crrlink;
				newTask.count       = this.currentTask.count;
				newTask.targetCount = this.currentTask.targetCount;
				newTask.depth       = this.currentTask.depth + 1;
				newTask.targetDepth = this.currentTask.targetDepth;
				newTask.words       = this.currentTask.words;
				newTask.requestId   = this.currentTask.requestId;
				newTask.categarory  = this.currentTask.categarory;

				this.requests.push(newTask);
			}
		}
	}
};

/**
 * Every time a new task poped from tasks array,
 * I need to update the current task to new url,
 * and check the current request whether that is 
 * satisfied.
 *
 * If satisfied (true), pop next task else fire away
 * unitl a new ClawRequest comes.
 *
 * Here, satisfied means that, current get page count
 * is greater than target count or the page depth greater
 * than the garget depth
 */
ClawerContext.prototype._updateCurrentTask = function(newTask) {
	var isSatisfied = false;
	if(this.currentTask == null || this.currentTask.requestId != newTask.requestId) {
		this.currentTask = newTask;
	} else {
		this.currentTask.url = newTask.url;

		isSatisfied = (
			this.currentTask.count >= this.currentTask.targetCount || 
			this.currentTask.depth >= this.currentTask.targetDepth
		);
	}

	return isSatisfied;
};


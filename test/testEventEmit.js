var util = require('util');
var events = require('events');
var async = require('async');
 
var Fighter = function() {
	events.EventEmitter.call(this);
};
util.inherits(Fighter, events.EventEmitter);

var sb = new Fighter();

var Sailor = function() {
	events.EventEmitter.call(sb);
};

util.inherits(Sailor, events.EventEmitter);

Sailor.prototype.fight = function() {
	var buildTask = function(i) {
		return function() {
			_this.emit('fight', 'I am a fighter --> ' + i);
		}
	}
	var _this = this;
	var tasks = [];
	for(var i = 0; i < 10000; i++){
		var task = buildTask(i);

		tasks.push(task);
	}

	async.parallel(tasks);
};

var laoniu = new Sailor();


sb.on('fight', function(msg) {
	console.log(msg);
});

laoniu.on('fight', function(msg) {
	console.log('fight myself --> 1 ' + msg);
});

laoniu.fight();
laoniu.fight();
laoniu.fight();
laoniu.fight();

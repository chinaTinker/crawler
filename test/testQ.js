var Q = require('q');
var util     = require('util');
var events   = require('events');

var User = function(name, bonus) {
	this.name = name;
	this.bonus = bonus;

	events.EventEmitter.call(this);
};
util.inherits(User, events.EventEmitter);

User.prototype.fight = function() {
	console.log(this.name + ' fighting !!!');

	this.emit('fight', 'Wa ha ha ha ~ ~');
	this.emit('girl', 'nice girl protect you!');
	this.emit('dead', 'i am dead');
};

var deffered = Q.defer();
var girlDeff = Q.defer();

var luffy = new User('Monkey.D.Luffy');

luffy.on('fight', function(x) {
	console.log('handle fight --> ' + x);
	deffered.resolve(x);
});

luffy.on('girl', function(x) {
	console.log('handle girl --> ' +  x );
	girlDeff.resolve(x);
});

luffy.on('dead', function(x) {
	console.log('handle dead --> ' + x);
	deffered.reject(x);
})

luffy.fight();

Q.all([deffered.promise, girlDeff.promise])
 .done(function(resolve, reject){
 	console.log('fight --> ' + resolve[0]);
 	console.log('girl --> ' + resolve[1]);
 })
 

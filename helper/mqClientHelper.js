/**
* mq client helper
* provide a client instance from pool
* 
* Tinker 2014-4-28
*/

var config = require('../conf/config.json');
var MQClinet = require('./mqClient.js');

var MQClientHelper = function(){};

/** max count of client instance */
MQClientHelper.max =  config.mq.max || 3,

/** sign if the pool has inited */
MQClientHelper.hasInit = false,
	
/** client pool */
MQClientHelper.pool = [],

/**
 * init the pool, fill the mq client 
 * intants with the max count
 */
MQClientHelper.init = function() {
	for(var i = 0; i < this.max; i++) {
		this.pool.push(new MQClinet());
	}

	MQClientHelper.hasInit = true;
},

/** generate a random index */
MQClientHelper.randInd = function() {
  return Math.floor(Math.random() * (this.max - 0) + 0);
},

/**
 *  get a client instance from pool
 */
MQClientHelper.getClient = function() {
	if(!this.hasInit) {
		this.init();
	}

	return this.pool[this.randInd()]
};

module.exports = MQClientHelper;
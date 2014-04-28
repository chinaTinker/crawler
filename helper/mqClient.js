/**
 *   tinker
 *   2014-4-25
 *   
 *   RabbitMQ client warpper
 */
var config = require('../conf/config.json'); 
var amqp   = require('amqp');

var MQClient = function() {
	var _this = this;

	_this.isReady = false;
 	_this.connection = amqp.createConnection({host: config.mq.host});
 	_this.connection.on('ready', function() {
 		_this.queue =	_this.connection.queue(config.mq.queue, function(q){
 			q.bind(config.mq.exchange || '#', config.mq.routeKey || '');

 			console.log("queue has been ready!");
 		});

 		_this.exchange = _this.connection.exchange(config.mq.exchange || '#', function(ex){
 			console.log("exchange has opened!");
 		});

 		_this.isReady = true;
 	});

};

MQClient.prototype.publish = function(message, callback) {
	var _this = this;
	if(this.isReady) {
		this.exchange.publish(config.mq.routeKey || '',  message, callback);
	} else {
		setTimeout(function() {
			_this.publish(message, callback);
		}, 200);
	}
};

MQClient.prototype.subscribe = function(messageHandler) {
	var _this = this;
	if(this.isReady) {
		_this.queue.subscribe(function(message, headers, deliveryInfo, messageObject) {
			if(messageHandler && typeof messageHandler === 'function') {
				messageHandler(message);
			}
		});
	} else {
		setTimeout(function() {
			_this.subscribe(messageHandler);
		}, 200);
	}
};

MQClient.prototype.close = function() {
	if(this.connection) {
		this.connection.disconnect();
	}
};

module.exports = MQClient;
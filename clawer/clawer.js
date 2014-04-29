/*
* web clawer
*
* Tinker 2014-3-6 
*/
var http         = require("http");
var linkParser   = require("../parser/achorParser.js");
var iconv 			 = require('iconv-lite');
var BufferHelper = require('bufferhelper');
var urlencode    = require('urlencode');
var events       = require('events');
var util         = require('util');

var Clawer = function(httpOpts) {
	this.options = httpOpts;
	this.bufferHelper = new BufferHelper();
	events.EventEmitter.call(this);

	this.on('ready', this._isMoreLinks);
};

util.inherits(Clawer, events.EventEmitter);

/**
 * set fire to the server
 * fetch the page content
 * and prepare the event handler
 */
Clawer.prototype.fetch = function() {
	console.log(this.options);

	var _this = this;
	var request = http.request(this.options, function(resp) {
		resp.on('error', function(e) {
			console.log(e);
			request.abort();
			_this.emit('error', e);
		});

		resp.on('end', function() {
			var data = _this.bufferHelper.toBuffer().toString();
			_this.emit('ready', data);
		});

		resp.on('data', function(chunck) {
			_this.bufferHelper.concat(chunck);
		});
	});
	
	request.setTimeout(30000, function() {
		this.emit('error', 'timeout');
	});

	request.on('error', function(e) {
		request.abort();
		_this.emit('error', e);
	})

	request.end();
};

/**
 * parse the all linkers from data
 */
Clawer.prototype._isMoreLinks = function(data) {
	if(data && data.length > 0) {
		var urls = linkParser.parse(data);

		if(urls && urls.length > 0) {
			this.emit('moreLinks', urls);
		}
	}
};

module.exports = Clawer;

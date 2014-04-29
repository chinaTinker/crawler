var parser = require('../parser/achorParser.js');
var cache  = require('../helper/cache.js');

var url = 'http://sssss.com';
//cache.push(url);

console.log(cache.isExited(url));

var urls = parser.parse('<a href="http://www.kanchufang.com"></a><a href="mailto:xxx"></a><a href="xxxxx"/><a href="javascript:ss"/>');

console.log(urls);

var urlParser = require('url');

var reg = /^(http\:\/\/yyk.99.com.cn){0,1}\/[a-z]+(\/[0-9]+)*\/$/
var doTest = function(link) {
	console.log("test link --> " + link);

	reg.test(link)? console.log("success") : console.log("failed");
};

doTest("http://yyk.99.com.cn/wanbai/73303/");
doTest("/heibei/");
doTest("http://jbk.99.com.cn/gwy/");
doTest("/keshi/shaoshangke.html");
doTest("/keshi/guke.html");


var url = urlParser.parse("/user/111");
console.log(url.path);
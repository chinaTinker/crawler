var Q = require('q');

var doTest = Q.async(function*() {
	var ten = yield 10;
	console.log(ten);

	var name = yield 'tinker';
	console.log(name);

	var hello = yield 'hello ' + name;
	console.log(hello);

	return hello;
});

doTest().then(function(hello) {
	console.log(hello);
}, function(x) {
	console.log(x);
});
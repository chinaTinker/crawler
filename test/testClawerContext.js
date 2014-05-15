var ClawRequest = require('../clawer/ClawRequest.js');
var Context = require('../clawer/ClawerContext.js');
var urlParser = require('urlparser');

var clawerHelper = {
	buildHttpOptions: function(task) {
		return {
			host: task.url,
			port: 80,
			path: '/'
		}
	}, 

	parseData: parseData
};


var clawerContext = new Context(clawerHelper);

clawerContext.on('over', function() {
	console.log("finished");
});

var clawRequest = new ClawRequest(1, 'hello', 8119);
clawerContext.addRequest(clawRequest);
clawerContext.fire();


var doLinksHandler = function(links) {
	if(links && links.length > 0) {
		for(var i = 0, len = links.length; i < len; i++) {
			var crrLink = links[i];
			if(isNeedFollow(crrLink)) {
				var url = urlParser.parse(crrLink);

				var newOpts = {
					hostname: opts.hostname,
					port:     opts.port,
					path:     url.path,
					method:   opts.method,
					charset:  opts.charset
				};

				var newClawer = new Clawer(newOpts);
				newClawer.on('ready', function(data) {
					 parseData(data);
				});
				
				newClawer.on('moreLinks', function(links) {
					doLinksHandler(links);
				});

				newClawer.on('error', function(e) {
					console.log(e);
				});

				newClawer.fetch();
			}
		}
	}
};

var isNeedFollow = function(link) {
	return !!link && (/^(http\:\/\/yyk.99.com.cn){0,1}\/[a-z]+(\/[0-9]+)*\/$/).test(link)
};

var parseData = function(data) {
	var $ = cheerio.load(data);

	var hospital = {
		name:  "",
		phone: "",
		nature: "",
		type:  "",
		level: "",
		addr:  "",
		province: "",
		city: 		"",
		area:  ""
	};

	var infos = $('p.bnleft').text().trim().split('>');
	if(infos && infos.length > 0) {
		hospital.name = infos[infos.length - 1].trim();

		for(var i = 1, len = infos.length - 1; i < len; i ++) {
			var crrInfo = infos[i].trim();
			if(/^.*省$/.test(crrInfo)) {
				hospital.province = crrInfo;
			} else if(/^.*市$/.test(crrInfo)) {
				hospital.city = crrInfo;
			} else if(/^.*区$/.test(crrInfo)) {
				hospital.area = crrInfo;
			}
		}

		if(hospital.province === '') {  hospital.province = hospital.city; }

		var details = $('div.hpi_content > ul > li');
		if(details && details.length > 0) {
			
			var getContent = function(index) {
				var crrArr = $(details[index]).text().trim().split("：");
				if(crrArr.length > 1) {
					return crrArr[1].trim();
				}
				return "未知";
			};

			hospital.alias  = getContent(0);
			hospital.nature = getContent(1);
			hospital.level  = getContent(2);
			hospital.phone  = getContent(3);
			hospital.addr   = getContent(4);
			hospital.spec   = getContent(5);
		}
		
		saveToFile(hospital);
	}
};

var saveToFile = function(hospital) {
	if(!hospital || hospital.name.length < 5) return;

	var crrLine = stringify(hospital);
	fs.writeFile("/Users/xuyifeng/test_files/hospitals-2014-5-13.txt", crrLine, {flag: 'a'}, function(err) {
		if(err) console.log('something wrong!');

		console.log(crrLine + "  has write to file");
	});
};

var stringify = function(hospital) {
	var sepertor = "\t";
	return hospital.name + sepertor +
		hospital.phone + sepertor + 
		hospital.nature + sepertor + 
		hospital.level + sepertor + 
		hospital.addr + sepertor +
		hospital.province + sepertor +
		hospital.city + sepertor + 
		hospital.area + "\n";
};


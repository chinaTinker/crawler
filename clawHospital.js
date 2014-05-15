/**
 * claw the hospital infos
 */
var Clawer  = require('./clawer/clawer.js');
var cheerio = require('cheerio');
var fs      = require('fs');
var pool    = require('./helper/mysqlHelper.js').pool;
var url     = require('url');
var tasks   = ["/"];
var maxTry  = 100;
var date    = new Date().toJSON().substring(0, 10);
var file    = "/Users/xuyifeng/test_files/hospitals-" + date + ".txt";

var opts = {
	hostname: 'yyk.99.com.cn',
	port: 80,
	path: '/',
	method: 'GET',
	charset: 'gb2312'
};
var clawer = new Clawer(opts);

var initClawer = function() {
	clawer.on('ready', function(data) {
	 parseData(data);
	 fireOne(maxTry || 100);
	});

	clawer.on('moreLinks', function(links) {
		doLinksHandler(links);
	});

	clawer.on('error', function(e) {
		console.log(e);
		fireOne(maxTry || 100);
	});
};

var fireOne = function(tryTime) {
	console.log("####### -> " + tasks.length);
	var newPath = tasks.pop();

	if(newPath) {
		clawer.options.path = newPath;
		clawer.fetch();
	}else {
		if(tryTime > 0) {
			setTimeout(function(){
				fireOne(tryTime - 1);
			}, 500);
		}else {
			console.log("job finished");
			process.exit(1);
		}
	}
};

var doLinksHandler = function(links) {
	if(links && links.length > 0) {
		for(var i = 0, len = links.length; i < len; i++) {

			isNeedFollow(links[i], function(theLink) {
				var urlOpts = url.parse(theLink);
				if(urlOpts.path && urlOpts.path.length > 0){
					tasks.push(urlOpts.path);
				}
			});
			
		}
	}
};

var isNeedFollow = function(link, callback) {
	hasParsed(link, function(isExisted){
		if(!isExisted) {
			pool.query("insert into link(url) value(?)", [link], function(err, result){
				if(err) return console.log("save failed! link = " + link);
			});

			if((/^(http\:\/\/yyk.99.com.cn){0,1}\/[a-z]+(\/[0-9]+)*\/$/).test(link)){
				callback(link);
			}
		}
	});

};

var hasParsed = function(link, callback) {
	pool.query("select 1 from link where url = ?", [link], function(err, result){
		if(err) {
			callback(true);
		} else {
			callback(!!result && result.length > 0);
		}

	});
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
		
		save(hospital);
	}
};

var saveToFile = function(hospital) {
	var crrLine = stringify(hospital);
	fs.writeFile(file, crrLine, {flag: 'a'}, function(err) {
		if(err) console.log('something wrong!');

		console.log(crrLine + "  has write to file");
	});
};

var save = function(hospital) {
	pool.query("select 1 from DoctorHospital where name = ?", [hospital.name], function(err, rows){
		if(err) return console.log(err);

		if(!rows || rows.length == 0) {
			var sql = "insert into DoctorHospital " +
								"(name, province, city, district, address, phone, nature, level) " +
								"value(?, ?, ?, ?, ?, ?, ?, ?)";
			var vals =[
									hospital.name,   hospital.province, hospital.city,
									hospital.area,   hospital.addr,     hospital.phone,
									hospital.nature, hospital.level
								];

			pool.query(sql, vals, function(err, result){});

			saveToFile(hospital);
		}
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

initClawer();
fireOne();




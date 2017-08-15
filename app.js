var Crawler = require("crawler");
var fs = require("fs");
var mkdirp = require("mkdirp");
//抓起所有小说主页url
var noteUrls = new Crawler({
	maxConnections: 20,
	// This will be called for each crawled page
	callback: function(error, res, done) {
		if(error) {
			console.log(error);
			let fileName = $("#main h2").text();
			fs.writeFile('./' + fileName + '--小说主页URL获取错误日志.txt', content, (err) => {
				if(err) throw err;
			});
		} else {
			var $ = res.$;
			var list = $("#main ul li a");
			for(var i = 0; i < 20; i++) {
				crawlerNote($(list[i]).attr("href"))
			}
		}
		done();
	}
});

noteUrls.queue("http://www.37zw.net/xiaoshuodaquan/");

var crawlerNotePromise = function (url) {
  return new Promise(function (resolve, reject) {
    fs.readFile(fileName, function(error, data) {
      if (error) return reject(error);
      resolve(data);
    });
  });
};

var crawlerNote = async function(url) {
	var map = new Map();
	//章节铺获
	var capture = new Crawler({
		maxConnections: 10,
		// This will be called for each crawled page
		callback: function(error, res, done) {
			if(error) {
				let fileName = $(".bookname h1").text();
				fs.writeFile('./' + fileName + '--errorDownLoad.txt', content, (err) => {
				});
			} else {
				var $ = res.$;
				let content = $("#content").text();
				let fileName = $(".bookname h1").text();
				let index = map.get(fileName);
				fs.writeFile('./' + map.get("dir") + '/' + (index+1+ "").padStart(4, '0') + "--" + fileName + ".txt", content, (err) => {
					console.log('The ' + fileName + ' has been saved!');
				});
			}
			done();
		}
	});
	//小说目录解析
	var c = new Crawler({
		maxConnections: 10,
		// This will be called for each crawled page
		callback: function(error, res, done) {
			if(error) {
				console.log(error);
			} else {
				var $ = res.$;
				let content = ''
				content = $("#list dt").text() + "目录如下\n\r";
				map.set("dir", $("#list dt").text());
				mkdirp($("#list dt").text(), function(err) {
					if(err) console.error(err)
					else console.log('pow!');
					return;
				});
				var list = $("#list a");
				for(var i = 0; i < list.length; i++) {
					content += ($(list[i]).text() + "\n\r");
					map.set($(list[i]).text(), i);
					capture.queue(url + $(list[i]).attr("href"));
				}
				console.log(list.length);
				fs.writeFile('./' + map.get("dir") + '/小说目录(共'+list.length+'章).txt', content, (err) => {
					if(err) throw err;
					console.log('The ' + $("#list dt").text() + '--目录已保存!');
				});
			}
			done();
		}
	});
	// Queue just one URL, with default callback
	await c.queue(url);
}
var Crawler = require("crawler");
var fs = require("fs");
var capture = new Crawler({
	maxConnections: 10,
	// This will be called for each crawled page
	callback: function(error, res, done) {
		if(error) {
			console.log(error);
		} else {
			var $ = res.$;
			let content = $("#content").text();
			let fileName = $(".bookname h1").text();
			fs.writeFile('./file/'+fileName+".txt", content, (err) => {
			  if (err) throw err;
			  console.log('The '+fileName+' has been saved!');
			});
		}
		done();
	}
});
capture.queue('http://www.37zw.net/0/330/1302951.html')

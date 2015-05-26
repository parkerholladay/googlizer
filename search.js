'use strict';

var request = require('request');

var startIndex = 1,
	searchTerm = 'Stanley Wanlass',
	options ={
	method: 'GET',
	url: '***',
	qs: {
		'key': '***',
		'cx': '***',
		'q': searchTerm,
		'start': startIndex
	}
};

var search = function() {
	request(options, function(error, response, body) {
		console.log('Response code: ' + response.statusCode);
		if(error) {
			console.log('Error searching: ' + error);
		} else {
			var responseBody = JSON.parse(body);
			console.log('Results count: ' + responseBody.queries.request[0].totalResults);
			console.log('Next page start index: ' + responseBody.queries.nextPage[0].startIndex);
			console.log('Search results:');
			for (var i in responseBody.items) {
				console.log(responseBody.items[i]);
			}
		}
	});
};

module.exports = search;

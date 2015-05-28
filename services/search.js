'use strict';

var request = require('request');

var execute = function(searchTerm, startIndex, callback) {
	var options = {
		method: 'GET',
		url: 'https://www.googleapis.com/customsearch/v1',
		qs: {
			key: '***',
			cx: '***',
			q: searchTerm,
			start: startIndex
		}
	};

	makeRequest(options, callback);
};

function makeRequest(options, callback) {
	request(options, function(error, response, body) {
		if(error || response.statusCode !== 200) {
			callback(error || JSON.parse(body), null);
		} else {
			callback(error, JSON.parse(body));
		}
	});
}

module.exports.execute = execute;

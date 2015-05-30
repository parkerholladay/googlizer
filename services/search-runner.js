'use strict';

var search = require('./search'),
	repository = require('../repositories/search-repository');

var resultsCount,
	query,
	searchResults = [];

var run = function() {
	repository.getNextQuery(function(error, queryResult) {
		if(error) {
			console.log('Error getting next query: ' + error);
		} else {
			query = queryResult;
			search.execute(query.searchTerm, query.nextIndex, handleResponse);
		}
	});
};

function handleResponse(error, response) {
	if(error) {
		console.log('Error searching:');
		console.log(error.error.message);
	} else {
		//TODO repo method to save/update query results
		searchResults.push(response.items);
		query.resultsCount = response.queries.request[0].totalResults;
		query.nextIndex = response.queries.nextPage[0].startIndex;
		
		updateQueryInfo(query);

		if(query.nextIndex < 10) {
			run();
		}
	}
}

function updateQueryInfo(query) {
	repository.updateQuery(query, function(error) {
		if(error) {
			console.log('Error updating query info: ' + error);
		}
	});
}

module.exports.run = run;

'use strict';

var search = require('./search'),
	repository = require('../repositories/search-repository');

var query;

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
		query.resultsCount = response.searchInformation.totalResults;
		query.nextIndex = response.queries.nextPage[0].startIndex;		

		saveSearchResults(query, response.items);
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

function saveSearchResults(query, results) {
	repository.updateSearchResults(query, results, function(error) {
		if(error) {
			console.log('Error updating search results: ' + error);
		}
	});
}

module.exports.run = run;

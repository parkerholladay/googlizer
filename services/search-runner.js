'use strict';

var search = require('./search');

var resultsCount,
	query = { searchTerm: 'Stanley Wanlass', nextIndex: 1},
	searchResults = [];

var run = function() {
	//TODO repo method to retrieve query info
	search.execute(query.searchTerm, query.nextIndex, handleResponse);
};

function handleResponse(error, response) {
	if(error) {
		//TODO repo method to update query info
		console.log('Error searching:');
		console.log(error.error.message);
	} else {
		//TODO repo method to save/update query results
		searchResults.push(response.items);
		resultsCount = response.queries.request[0].totalResults;
		query.nextIndex = response.queries.nextPage[0].startIndex;
		//TODO repo method to update query info

		if(query.nextIndex < 10) {
			run();
		}
	}
}

module.exports.run = run;

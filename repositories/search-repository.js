'use strict';

var cassandra = require('cassandra-driver');

var client;

var getNextQuery = function(callback) {
	var select = 'select id, last_completed_date, next_index, results_count, search_term from queries;',
		results = [];

	initializeClient();
	client.eachRow(select, function(n, row) {
		results.push({ 
			id: row.id,
			lastCompletedDate: row.last_completed_date,
			nextIndex: row.next_index,
			resultsCount: row.results_count,
			searchTerm: row.search_term
		});
	}, function(error, result) {
		callback(error, results[0]);
		client.shutdown();
	});
};

var updateQuery = function(query, callback) {
	var update = 'update queries set last_completed_date = :lastCompletedDate, next_index = :nextIndex, results_count = :resultsCount ' +
		'where id = :id;',
		params = { id: query.id, lastCompletedDate: query.lastCompletedDate, nextIndex: query.nextIndex, resultsCount: query.resultsCount };

	initializeClient();
	executeUpdateCommand(update, params, callback);
};

var updateSearchResults = function(query, results, callback) {
	var update = 'update search_results set search_term = :searchTerm, last_retrieved_date = :lastRetrievedDate, snippet = :snippet, title = :title ' +
		'where query_id = :queryId and url = :url;';
	
	initializeClient();
	for (var i = 0; i < results.length; i++) {
		var params = { 
			queryId: query.id,
			url: results[i].link,
			searchTerm: query.searchTerm,
			lastRetrievedDate: new Date(),
			snippet: results[i].snippet,
			title: results[i].title
		};

		executeUpdateCommand(update, params, callback);
	};
};

function initializeClient() {
	client = new cassandra.Client({contactPoints: ['localhost'], keyspace: 'search'});
}

function executeUpdateCommand(update, params, callback) {
	client.execute(update, params, { prepare: true }, function(error, result) {
		callback(error);
		client.shutdown();
	});

}

module.exports.getNextQuery = getNextQuery;
module.exports.updateQuery = updateQuery;
module.exports.updateSearchResults = updateSearchResults;

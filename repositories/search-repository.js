'use strict';

var cassandra = require('cassandra-driver');

var client;

var getNextQuery = function(callback) {
	var select = 'select id, last_completed_date, next_index, total_results, search_term from queries limit 1;',
		results = [];

	initializeClient();
	client.eachRow(select, function(n, row) {
		results.push({
			id: row.id,
			lastCompletedDate: row.last_completed_date,
			nextIndex: row.next_index,
			totalResults: row.total_results,
			searchTerm: row.search_term
		});
	}, function(error, result) {
		callback(error, results[0]);
		client.shutdown();
	});
};

var updateQuery = function(query, callback) {
	var update = 'update queries set last_completed_date = :lastCompletedDate, next_index = :nextIndex, total_results = :totalResults ' +
		'where id = :id;',
		params = {
			id: query.id,
			lastCompletedDate: query.lastCompletedDate,
			nextIndex: query.nextIndex,
			totalResults: query.totalResults
		};

	initializeClient();
	executeUpdateCommand(update, params, callback);
};

var updateSearchResults = function(query, results, callback) {
	var update = 'update search_results set search_term = :searchTerm, last_retrieved_date = :lastRetrievedDate, snippet = :snippet, title = :title ' +
		'where query_id = :queryId and url = :url;';
	
	initializeClient();
	results.forEach(function(result) {
		var params = {
			queryId: query.id,
			url: result.link,
			searchTerm: query.searchTerm,
			lastRetrievedDate: new Date(),
			snippet: result.snippet,
			title: result.title
		};

		client.execute(update, params, { prepare: true }, function(error, result) {
			setTimeout(callback(error), 1000);
			client.shutdown();
		});

	}, this);
};

function initializeClient() {
	if(!client) {
		client = new cassandra.Client({contactPoints: ['localhost'], keyspace: 'search'});
	}

	client.connect(function() {
		//do nothing
	});
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

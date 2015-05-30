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
	var update = 'update queries set last_completed_date = :lastCompletedDate, next_index = :nextIndex, results_count = :resultsCount where id = :id;',
		params = { id: query.id, lastCompletedDate: query.lastCompletedDate, nextIndex: query.nextIndex, resultsCount: query.resultsCount };

	initializeClient();
	client.execute(update, params, {prepare: true}, function(error, result) {
		callback(error);
		client.shutdown();
	});
};

function initializeClient() {
	client = new cassandra.Client({contactPoints: ['localhost'], keyspace: 'search'});
}

module.exports.getNextQuery = getNextQuery;
module.exports.updateQuery = updateQuery;
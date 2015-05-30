create table if not exists search.search_results (
	query_id text,
	url text,
	search_term text static,
	is_validated boolean,
	is_duplicate boolean,
	last_retrieved_date timestamp,
	last_validated_date timestamp,
	notes text,
	snippet text,
	title text,
	primary key (query_id, url)
);

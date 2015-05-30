create table if not exists search.queries (
	id text,
	last_completed_date timestamp,
	next_index int,
	results_count int,
	search_term text,
	primary key (id)
);

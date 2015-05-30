create table if not exists search.queries (
	id text,
	last_completed_date timestamp,
	next_index int,
	total_results int,
	search_term text,
	primary key (id)
);

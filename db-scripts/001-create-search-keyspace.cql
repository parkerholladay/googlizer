create keyspace if not exists search
	with replication = {'class': 'SimpleStrategy', 'replication_factor': 1};

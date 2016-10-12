#!/usr/bin/env bash

# sample script for Question 1

DBNAME=assign2
for query in q1-is-b.sql q1-bis-b.sql q2-bis-cb.sql q2-is-cb.sql q3-bis-c.sql q3-ios-cb.sql q3-is-c.sql q4-abis-b-c.sql q4-bis-cb.sql q5-bis-cb.sql q5-is-b.sql q6-bis-cb.sql q6-is-b.sql q6-ss.sql q6-bis-c.sql q6-is-cb.sql
do
	# reset statistics
	psql -c "SELECT pg_stat_reset();" ${DBNAME}
	# clear OS cache
	if  [ -e /opt/bin/dropcache ]; then
		# running on compute cluster
		/opt/bin/dropcache
	else
		# running on own machine
		sudo sh -c "sync; echo 3 > /proc/sys/vm/drop_caches"
	fi
	psql -f $query ${DBNAME}
	# clear buffer pool
	psql -c "SELECT dropdbbuffers('assign2');" ${DBNAME}
	psql -c "SELECT pg_sleep(2);" ${DBNAME}
	# get run-time statistics
	psql -c "SELECT relname, heap_blks_read, heap_blks_hit, idx_blks_read, idx_blks_hit FROM pg_statio_all_tables WHERE relname = 'r';" ${DBNAME}
done



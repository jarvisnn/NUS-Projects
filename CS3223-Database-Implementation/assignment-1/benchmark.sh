#!/usr/bin/env bash

if [ $# -ne 1 ]; then
	echo "ERROR: output filename argument is missing!"
	exit 1
fi

RESULTFILE=$1

if [ -f ${RESULTFILE} ]; then
	echo "ERROR: file with name ${RESULTFILE} already exists!"
	exit 1
fi


# check that server is running
if ! pg_ctl status > /dev/null; then
	echo "ERROR: postgres server is not running!"
	exit 1;
fi

DBNAME=assign1

# if database doesn't exists, create database
if ! psql -l | grep -q "$DBNAME"; then
	echo "Creating database ${DBNAME} ..."
	createdb "${DBNAME}"
fi



# check that number of shared buffer pages is configured to 32 pages
if ! psql -c "SHOW shared_buffers;" $DBNAME | grep "256kB"; then
	echo "ERROR: restart server with 32 buffer pages!"
	exit 1;
fi


# remove benchmark database relations if they exist
psql $DBNAME <<END
DROP TABLE IF EXISTS pgbench_history;
DROP TABLE IF EXISTS pgbench_tellers;
DROP TABLE IF EXISTS pgbench_accounts;
DROP TABLE IF EXISTS pgbench_branches;
\q
END


# create benchmark database relations with scale factor of 10
pgbench -i -s 10 --unlogged-tables  $DBNAME

# reset statistics counters 
psql -c "SELECT pg_stat_reset();" $DBNAME

# clear OS cache
if  [ -e /opt/bin/dropcache ]; then
	# running on compute cluster
	/opt/bin/dropcache
else
	# running on own machine
	sudo sh -c "sync; echo 3 > /proc/sys/vm/drop_caches"
fi

# run benchmark  with 10 clients for a duration of 3 minutes
pgbench -c 10 -T 180 -s 10 $DBNAME > ${RESULTFILE}

# calculate buffer hit ratio
psql -c "SELECT SUM(heap_blks_read) AS heap_read, SUM(heap_blks_hit)  AS heap_hit, SUM(heap_blks_hit) / (SUM(heap_blks_hit) + SUM(heap_blks_read))  AS ratio FROM pg_statio_user_tables;" $DBNAME >> ${RESULTFILE}


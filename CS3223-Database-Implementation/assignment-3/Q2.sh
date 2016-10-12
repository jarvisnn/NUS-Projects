#!/usr/bin/env bash

# Assignment 3
# Sample script to run experiment 1A for indexed nested loop join algorithm

DBNAME=assign3

# check that server is running
if ! pg_ctl status > /dev/null; then
	echo "ERROR: postgres server is not running!"
	exit 1;
fi


# set PORTOPTION appropriately depending on whether server is running with non-default port number
PORTNUMBER=$(pg_ctl status | grep "\-p" | awk '{print $3}')
PORTNUMBER=${PORTNUMBER//\"/}
if [ "${PORTNUMBER}" ]; then
	PORTOPTION=" -p $PORTNUMBER"
else
	PORTOPTION=""
fi


echo "-------------------------- Question 2--------------------------------"


echo "-------------------------- 2A - INLJ --------------------------------"
####################################### vary selectivity of selection predicate
for i in 5 10 20 40 80
do
	####################################### load data
	./loaddata.sh 100000 $i

	if  [ -e /opt/bin/dropcache ]; then
		# running on compute cluster node
		/opt/bin/dropcache
	elif [ -e /proc/sys/vm/drop_caches ]; then
		# running on own machine
		sudo sh -c "sync; echo 3 > /proc/sys/vm/drop_caches"
	fi
	psql -e -v v=25000 ${PORTOPTION} $DBNAME <<EOF
	SET work_mem TO 4096;
	SET enable_nestloop TO on;
	SET enable_indexscan TO on;
	SET enable_mergejoin TO off;
	SET enable_hashjoin TO off;
	SELECT pg_stat_reset();
	SELECT dropdbbuffers('assign3');
	EXPLAIN (ANALYZE, BUFFERS) SELECT r.c, s.z FROM r JOIN s ON r.a = s.y WHERE r.b <= :v;
	SELECT pg_sleep(2);
	SELECT relname, heap_blks_read, heap_blks_hit, idx_blks_read, idx_blks_hit FROM pg_statio_all_tables WHERE relname IN ('r', 's');
	\q
EOF
done

echo "-------------------------- 2A - SMJ --------------------------------"
####################################### vary selectivity of selection predicate
for i in 5 10 20 40 80
do
	####################################### load data
	./loaddata.sh 100000 $i

	if  [ -e /opt/bin/dropcache ]; then
		# running on compute cluster node
		/opt/bin/dropcache
	elif [ -e /proc/sys/vm/drop_caches ]; then
		# running on own machine
		sudo sh -c "sync; echo 3 > /proc/sys/vm/drop_caches"
	fi
	psql -e -v v=25000 ${PORTOPTION} $DBNAME <<EOF
	SET work_mem TO 4096;
	SET enable_nestloop TO off;
	SET enable_indexscan TO off;
	SET enable_mergejoin TO on;
	SET enable_hashjoin TO off;
	SELECT pg_stat_reset();
	SELECT dropdbbuffers('assign3');
	EXPLAIN (ANALYZE, BUFFERS) SELECT r.c, s.z FROM r JOIN s ON r.a = s.y WHERE r.b <= :v;
	SELECT pg_sleep(2);
	SELECT relname, heap_blks_read, heap_blks_hit, idx_blks_read, idx_blks_hit FROM pg_statio_all_tables WHERE relname IN ('r', 's');
	\q
EOF
done

echo "-------------------------- 2A - SMJ-I --------------------------------"
####################################### vary selectivity of selection predicate
for i in 5 10 20 40 80
do
	####################################### load data
	./loaddata.sh 100000 $i

	if  [ -e /opt/bin/dropcache ]; then
		# running on compute cluster node
		/opt/bin/dropcache
	elif [ -e /proc/sys/vm/drop_caches ]; then
		# running on own machine
		sudo sh -c "sync; echo 3 > /proc/sys/vm/drop_caches"
	fi
	psql -e -v v=25000 ${PORTOPTION} $DBNAME <<EOF
	SET work_mem TO 4096;
	SET enable_nestloop TO off;
	SET enable_indexscan TO on;
	SET enable_mergejoin TO on;
	SET enable_hashjoin TO off;
	SELECT pg_stat_reset();
	SELECT dropdbbuffers('assign3');
	EXPLAIN (ANALYZE, BUFFERS) SELECT r.c, s.z FROM r JOIN s ON r.a = s.y WHERE r.b <= :v;
	SELECT pg_sleep(2);
	SELECT relname, heap_blks_read, heap_blks_hit, idx_blks_read, idx_blks_hit FROM pg_statio_all_tables WHERE relname IN ('r', 's');
	\q
EOF
done

echo "-------------------------- 2A - HJ --------------------------------"
####################################### vary selectivity of selection predicate
for i in 5 10 20 40 80
do
	####################################### load data
	./loaddata.sh 100000 $i

	if  [ -e /opt/bin/dropcache ]; then
		# running on compute cluster node
		/opt/bin/dropcache
	elif [ -e /proc/sys/vm/drop_caches ]; then
		# running on own machine
		sudo sh -c "sync; echo 3 > /proc/sys/vm/drop_caches"
	fi
	psql -e -v v=25000 ${PORTOPTION} $DBNAME <<EOF
	SET work_mem TO 4096;
	SET enable_nestloop TO off;
	SET enable_indexscan TO off;
	SET enable_mergejoin TO off;
	SET enable_hashjoin TO on;
	SELECT pg_stat_reset();
	SELECT dropdbbuffers('assign3');
	EXPLAIN (ANALYZE, BUFFERS) SELECT r.c, s.z FROM r JOIN s ON r.a = s.y WHERE r.b <= :v;
	SELECT pg_sleep(2);
	SELECT relname, heap_blks_read, heap_blks_hit, idx_blks_read, idx_blks_hit FROM pg_statio_all_tables WHERE relname IN ('r', 's');
	\q
EOF
done



echo "-------------------------- 2B - INLJ --------------------------------"
####################################### vary selectivity of selection predicate
for i in 5 10 20 40 80
do
	####################################### load data
	./loaddata.sh 100000 $i

	if  [ -e /opt/bin/dropcache ]; then
		# running on compute cluster node
		/opt/bin/dropcache
	elif [ -e /proc/sys/vm/drop_caches ]; then
		# running on own machine
		sudo sh -c "sync; echo 3 > /proc/sys/vm/drop_caches"
	fi
	psql -e -v v=25000 ${PORTOPTION} $DBNAME <<EOF
	SET work_mem TO 4096;
	SET enable_nestloop TO on;
	SET enable_indexscan TO on;
	SET enable_mergejoin TO off;
	SET enable_hashjoin TO off;
	SELECT pg_stat_reset();
	SELECT dropdbbuffers('assign3');
	EXPLAIN (ANALYZE, BUFFERS) SELECT z FROM S WHERE EXISTS (SELECT * FROM r WHERE r.a = s.y AND r.b <= :v);
	SELECT pg_sleep(2);
	SELECT relname, heap_blks_read, heap_blks_hit, idx_blks_read, idx_blks_hit FROM pg_statio_all_tables WHERE relname IN ('r', 's');
	\q
EOF
done

echo "-------------------------- 2B - SMJ --------------------------------"
####################################### vary selectivity of selection predicate
for i in 5 10 20 40 80
do
	####################################### load data
	./loaddata.sh 100000 $i

	if  [ -e /opt/bin/dropcache ]; then
		# running on compute cluster node
		/opt/bin/dropcache
	elif [ -e /proc/sys/vm/drop_caches ]; then
		# running on own machine
		sudo sh -c "sync; echo 3 > /proc/sys/vm/drop_caches"
	fi
	psql -e -v v=25000 ${PORTOPTION} $DBNAME <<EOF
	SET work_mem TO 4096;
	SET enable_nestloop TO off;
	SET enable_indexscan TO off;
	SET enable_mergejoin TO on;
	SET enable_hashjoin TO off;
	SELECT pg_stat_reset();
	SELECT dropdbbuffers('assign3');
	EXPLAIN (ANALYZE, BUFFERS) SELECT z FROM S WHERE EXISTS (SELECT * FROM r WHERE r.a = s.y AND r.b <= :v);
	SELECT pg_sleep(2);
	SELECT relname, heap_blks_read, heap_blks_hit, idx_blks_read, idx_blks_hit FROM pg_statio_all_tables WHERE relname IN ('r', 's');
	\q
EOF
done

echo "-------------------------- 2B - SMJ-I --------------------------------"
####################################### vary selectivity of selection predicate
for i in 5 10 20 40 80
do
	####################################### load data
	./loaddata.sh 100000 $i

	if  [ -e /opt/bin/dropcache ]; then
		# running on compute cluster node
		/opt/bin/dropcache
	elif [ -e /proc/sys/vm/drop_caches ]; then
		# running on own machine
		sudo sh -c "sync; echo 3 > /proc/sys/vm/drop_caches"
	fi
	psql -e -v v=25000 ${PORTOPTION} $DBNAME <<EOF
	SET work_mem TO 4096;
	SET enable_nestloop TO off;
	SET enable_indexscan TO on;
	SET enable_mergejoin TO on;
	SET enable_hashjoin TO off;
	SELECT pg_stat_reset();
	SELECT dropdbbuffers('assign3');
	EXPLAIN (ANALYZE, BUFFERS) SELECT z FROM S WHERE EXISTS (SELECT * FROM r WHERE r.a = s.y AND r.b <= :v);
	SELECT pg_sleep(2);
	SELECT relname, heap_blks_read, heap_blks_hit, idx_blks_read, idx_blks_hit FROM pg_statio_all_tables WHERE relname IN ('r', 's');
	\q
EOF
done

echo "-------------------------- 2B - HJ --------------------------------"
####################################### vary selectivity of selection predicate
for i in 5 10 20 40 80
do
	####################################### load data
	./loaddata.sh 100000 $i

	if  [ -e /opt/bin/dropcache ]; then
		# running on compute cluster node
		/opt/bin/dropcache
	elif [ -e /proc/sys/vm/drop_caches ]; then
		# running on own machine
		sudo sh -c "sync; echo 3 > /proc/sys/vm/drop_caches"
	fi
	psql -e -v v=25000 ${PORTOPTION} $DBNAME <<EOF
	SET work_mem TO 4096;
	SET enable_nestloop TO off;
	SET enable_indexscan TO off;
	SET enable_mergejoin TO off;
	SET enable_hashjoin TO on;
	SELECT pg_stat_reset();
	SELECT dropdbbuffers('assign3');
	EXPLAIN (ANALYZE, BUFFERS) SELECT z FROM S WHERE EXISTS (SELECT * FROM r WHERE r.a = s.y AND r.b <= :v);
	SELECT pg_sleep(2);
	SELECT relname, heap_blks_read, heap_blks_hit, idx_blks_read, idx_blks_hit FROM pg_statio_all_tables WHERE relname IN ('r', 's');
	\q
EOF
done




echo "-------------------------- 2C - INLJ --------------------------------"
####################################### vary selectivity of selection predicate
for i in 5 10 20 40 80
do
	####################################### load data
	./loaddata.sh 100000 $i

	if  [ -e /opt/bin/dropcache ]; then
		# running on compute cluster node
		/opt/bin/dropcache
	elif [ -e /proc/sys/vm/drop_caches ]; then
		# running on own machine
		sudo sh -c "sync; echo 3 > /proc/sys/vm/drop_caches"
	fi
	psql -e -v v=25000 ${PORTOPTION} $DBNAME <<EOF
	SET work_mem TO 4096;
	SET enable_nestloop TO on;
	SET enable_indexscan TO on;
	SET enable_mergejoin TO off;
	SET enable_hashjoin TO off;
	SELECT pg_stat_reset();
	SELECT dropdbbuffers('assign3');
	EXPLAIN (ANALYZE, BUFFERS) SELECT z FROM S WHERE NOT EXISTS (SELECT * FROM r WHERE r.a = s.y AND r.b <= :v);
	SELECT pg_sleep(2);
	SELECT relname, heap_blks_read, heap_blks_hit, idx_blks_read, idx_blks_hit FROM pg_statio_all_tables WHERE relname IN ('r', 's');
	\q
EOF
done

echo "-------------------------- 2C - SMJ --------------------------------"
####################################### vary selectivity of selection predicate
for i in 5 10 20 40 80
do
	####################################### load data
	./loaddata.sh 100000 $i

	if  [ -e /opt/bin/dropcache ]; then
		# running on compute cluster node
		/opt/bin/dropcache
	elif [ -e /proc/sys/vm/drop_caches ]; then
		# running on own machine
		sudo sh -c "sync; echo 3 > /proc/sys/vm/drop_caches"
	fi
	psql -e -v v=25000 ${PORTOPTION} $DBNAME <<EOF
	SET work_mem TO 4096;
	SET enable_nestloop TO off;
	SET enable_indexscan TO off;
	SET enable_mergejoin TO on;
	SET enable_hashjoin TO off;
	SELECT pg_stat_reset();
	SELECT dropdbbuffers('assign3');
	EXPLAIN (ANALYZE, BUFFERS) SELECT z FROM S WHERE NOT EXISTS (SELECT * FROM r WHERE r.a = s.y AND r.b <= :v);
	SELECT pg_sleep(2);
	SELECT relname, heap_blks_read, heap_blks_hit, idx_blks_read, idx_blks_hit FROM pg_statio_all_tables WHERE relname IN ('r', 's');
	\q
EOF
done

echo "-------------------------- 2C - SMJ-I --------------------------------"
####################################### vary selectivity of selection predicate
for i in 5 10 20 40 80
do
	####################################### load data
	./loaddata.sh 100000 $i

	if  [ -e /opt/bin/dropcache ]; then
		# running on compute cluster node
		/opt/bin/dropcache
	elif [ -e /proc/sys/vm/drop_caches ]; then
		# running on own machine
		sudo sh -c "sync; echo 3 > /proc/sys/vm/drop_caches"
	fi
	psql -e -v v=25000 ${PORTOPTION} $DBNAME <<EOF
	SET work_mem TO 4096;
	SET enable_nestloop TO off;
	SET enable_indexscan TO on;
	SET enable_mergejoin TO on;
	SET enable_hashjoin TO off;
	SELECT pg_stat_reset();
	SELECT dropdbbuffers('assign3');
	EXPLAIN (ANALYZE, BUFFERS) SELECT z FROM S WHERE NOT EXISTS (SELECT * FROM r WHERE r.a = s.y AND r.b <= :v);
	SELECT pg_sleep(2);
	SELECT relname, heap_blks_read, heap_blks_hit, idx_blks_read, idx_blks_hit FROM pg_statio_all_tables WHERE relname IN ('r', 's');
	\q
EOF
done

echo "-------------------------- 2C - HJ --------------------------------"
####################################### vary selectivity of selection predicate
for i in 5 10 20 40 80
do
	####################################### load data
	./loaddata.sh 100000 $i

	if  [ -e /opt/bin/dropcache ]; then
		# running on compute cluster node
		/opt/bin/dropcache
	elif [ -e /proc/sys/vm/drop_caches ]; then
		# running on own machine
		sudo sh -c "sync; echo 3 > /proc/sys/vm/drop_caches"
	fi
	psql -e -v v=25000 ${PORTOPTION} $DBNAME <<EOF
	SET work_mem TO 4096;
	SET enable_nestloop TO off;
	SET enable_indexscan TO off;
	SET enable_mergejoin TO off;
	SET enable_hashjoin TO on;
	SELECT pg_stat_reset();
	SELECT dropdbbuffers('assign3');
	EXPLAIN (ANALYZE, BUFFERS) SELECT z FROM S WHERE NOT EXISTS (SELECT * FROM r WHERE r.a = s.y AND r.b <= :v);
	SELECT pg_sleep(2);
	SELECT relname, heap_blks_read, heap_blks_hit, idx_blks_read, idx_blks_hit FROM pg_statio_all_tables WHERE relname IN ('r', 's');
	\q
EOF
done

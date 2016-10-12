\echo -- ---------------------------------Q6
SELECT pg_stat_reset();
SELECT dropdbbuffers('assign2');
SET enable_bitmapscan = off; SET enable_indexscan = on;
SET enable_indexonlyscan = off; SET enable_seqscan = off;
BEGIN;
DROP index cb_idx;
EXPLAIN ANALYZE SELECT * FROM r WHERE b>9 AND c=10;
ROLLBACK;
SELECT pg_sleep(2);
SELECT relname, heap_blks_read, heap_blks_hit, idx_blks_read, idx_blks_hit FROM pg_statio_all_tables WHERE relname = 'r';
\echo -- ---------------------------------Q6
SELECT pg_stat_reset();
SELECT dropdbbuffers('assign2');
SET enable_bitmapscan = on; SET enable_indexscan = off;
SET enable_indexonlyscan = off; SET enable_seqscan = off;
BEGIN;
DROP index cb_idx;
EXPLAIN ANALYZE SELECT * FROM r WHERE b>9 AND c=10;
ROLLBACK;
SELECT pg_sleep(2);
SELECT relname, heap_blks_read, heap_blks_hit, idx_blks_read, idx_blks_hit FROM pg_statio_all_tables WHERE relname = 'r';
\echo -- ---------------------------------Q6
SELECT pg_stat_reset();
SELECT dropdbbuffers('assign2');
SET enable_bitmapscan = off; SET enable_indexscan = on;
SET enable_indexonlyscan = off; SET enable_seqscan = off;
BEGIN;
DROP index cb_idx;
DROP index c_idx;
EXPLAIN ANALYZE SELECT * FROM r WHERE b>9 AND c=10;
ROLLBACK;
SELECT pg_sleep(2);
SELECT relname, heap_blks_read, heap_blks_hit, idx_blks_read, idx_blks_hit FROM pg_statio_all_tables WHERE relname = 'r';
\echo -- ---------------------------------Q6
SELECT pg_stat_reset();
SELECT dropdbbuffers('assign2');
SET enable_bitmapscan = on; SET enable_indexscan = off;
SET enable_indexonlyscan = off; SET enable_seqscan = off;
BEGIN;
DROP index cb_idx;
DROP index c_idx;
EXPLAIN ANALYZE SELECT * FROM r WHERE b>9 AND c=10;
ROLLBACK;
SELECT pg_sleep(2);
SELECT relname, heap_blks_read, heap_blks_hit, idx_blks_read, idx_blks_hit FROM pg_statio_all_tables WHERE relname = 'r';
\echo -- ---------------------------------Q6
SELECT pg_stat_reset();
SELECT dropdbbuffers('assign2');
SET enable_bitmapscan = off; SET enable_indexscan = on;
SET enable_indexonlyscan = off; SET enable_seqscan = off;
BEGIN;
DROP index cb_idx;
DROP index b_idx;
EXPLAIN ANALYZE SELECT * FROM r WHERE b>9 AND c=10;
ROLLBACK;
SELECT pg_sleep(2);
SELECT relname, heap_blks_read, heap_blks_hit, idx_blks_read, idx_blks_hit FROM pg_statio_all_tables WHERE relname = 'r';
\echo -- ---------------------------------Q6
SELECT pg_stat_reset();
SELECT dropdbbuffers('assign2');
SET enable_bitmapscan = on; SET enable_indexscan = off;
SET enable_indexonlyscan = off; SET enable_seqscan = off;
BEGIN;
DROP index cb_idx;
DROP index b_idx;
EXPLAIN ANALYZE SELECT * FROM r WHERE b>9 AND c=10;
ROLLBACK;
SELECT pg_sleep(2);
SELECT relname, heap_blks_read, heap_blks_hit, idx_blks_read, idx_blks_hit FROM pg_statio_all_tables WHERE relname = 'r';
\echo -- ---------------------------------Q6
SELECT pg_stat_reset();
SELECT dropdbbuffers('assign2');
SET enable_bitmapscan = off; SET enable_indexscan = on;
SET enable_indexonlyscan = off; SET enable_seqscan = off;
BEGIN;
DROP index b_idx;
EXPLAIN ANALYZE SELECT * FROM r WHERE b>9 AND c=10;
ROLLBACK;
SELECT pg_sleep(2);
SELECT relname, heap_blks_read, heap_blks_hit, idx_blks_read, idx_blks_hit FROM pg_statio_all_tables WHERE relname = 'r';
\echo -- ---------------------------------Q6
SELECT pg_stat_reset();
SELECT dropdbbuffers('assign2');
SET enable_bitmapscan = on; SET enable_indexscan = off;
SET enable_indexonlyscan = off; SET enable_seqscan = off;
BEGIN;
DROP index b_idx;
EXPLAIN ANALYZE SELECT * FROM r WHERE b>9 AND c=10;
ROLLBACK;
SELECT pg_sleep(2);
SELECT relname, heap_blks_read, heap_blks_hit, idx_blks_read, idx_blks_hit FROM pg_statio_all_tables WHERE relname = 'r';
\echo -- ---------------------------------Q6
SELECT pg_stat_reset();
SELECT dropdbbuffers('assign2');
SET enable_bitmapscan = off; SET enable_indexscan = on;
SET enable_indexonlyscan = off; SET enable_seqscan = off;
BEGIN;
DROP index c_idx;
EXPLAIN ANALYZE SELECT * FROM r WHERE b>9 AND c=10;
ROLLBACK;
SELECT pg_sleep(2);
SELECT relname, heap_blks_read, heap_blks_hit, idx_blks_read, idx_blks_hit FROM pg_statio_all_tables WHERE relname = 'r';
\echo -- ---------------------------------Q6
SELECT pg_stat_reset();
SELECT dropdbbuffers('assign2');
SET enable_bitmapscan = on; SET enable_indexscan = off;
SET enable_indexonlyscan = off; SET enable_seqscan = off;
BEGIN;
DROP index c_idx;
EXPLAIN ANALYZE SELECT * FROM r WHERE b>9 AND c=10;
ROLLBACK;
SELECT pg_sleep(2);
SELECT relname, heap_blks_read, heap_blks_hit, idx_blks_read, idx_blks_hit FROM pg_statio_all_tables WHERE relname = 'r';
\echo -- ---------------------------------Q6
SELECT pg_stat_reset();
SELECT dropdbbuffers('assign2');
SET enable_bitmapscan = off; SET enable_indexscan = off;
SET enable_indexonlyscan = off; SET enable_seqscan = on;
EXPLAIN ANALYZE SELECT * FROM r WHERE b>9 AND c=10;
SELECT pg_sleep(2);
SELECT relname, heap_blks_read, heap_blks_hit, idx_blks_read, idx_blks_hit FROM pg_statio_all_tables WHERE relname = 'r';
-----------------------------------End of file
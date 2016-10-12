\echo ---------------- Question 2: BIS-cb plan
SET enable_seqscan = OFF;
SET enable_bitmapscan = ON;
SET enable_indexonlyscan = OFF;
SET enable_indexscan = OFF;
BEGIN;
DROP index c_idx;
EXPLAIN (ANALYZE,  BUFFERS) SELECT * FROM r WHERE c=10;
ROLLBACK;

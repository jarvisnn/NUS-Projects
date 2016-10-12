\echo ---------------- Question 2: IS-cb plan
SET enable_seqscan = OFF;
SET enable_bitmapscan = OFF;
SET enable_indexonlyscan = OFF;
SET enable_indexscan = ON;
BEGIN;
DROP index c_idx;
EXPLAIN (ANALYZE,  BUFFERS) SELECT * FROM r WHERE c=10;
ROLLBACK;

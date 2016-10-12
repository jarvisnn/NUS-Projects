\echo ---------------- Question 5: BIS-cb plan
SET enable_seqscan = OFF;
SET enable_bitmapscan = ON;
SET enable_indexonlyscan = OFF;
SET enable_indexscan = OFF;
BEGIN;
DROP index b_idx;
EXPLAIN (ANALYZE,  BUFFERS) SELECT * FROM r WHERE b=10 AND c>0;
ROLLBACK;

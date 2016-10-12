\echo ---------------- Question 6: IS-cb plan
SET enable_seqscan = OFF;
SET enable_bitmapscan = OFF;
SET enable_indexonlyscan = OFF;
SET enable_indexscan = ON;
BEGIN;
DROP index b_idx;
DROP index c_idx;
EXPLAIN (ANALYZE,  BUFFERS) SELECT * FROM r WHERE b>9 AND c=10;
ROLLBACK;

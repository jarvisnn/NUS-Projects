\echo ---------------- Question 5: IS-b plan
SET enable_seqscan = OFF;
SET enable_bitmapscan = OFF;
SET enable_indexonlyscan = OFF;
SET enable_indexscan = ON;
BEGIN;
DROP index cb_idx;
EXPLAIN (ANALYZE,  BUFFERS) SELECT * FROM r WHERE b=10 AND c>0;
ROLLBACK;

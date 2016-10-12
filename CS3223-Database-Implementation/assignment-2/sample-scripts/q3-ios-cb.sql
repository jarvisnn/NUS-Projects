\echo ---------------- Question 3: IOS-cb plan
SET enable_seqscan = OFF;
SET enable_bitmapscan = OFF;
SET enable_indexonlyscan = ON;
SET enable_indexscan = OFF;
BEGIN;
DROP index c_idx;
EXPLAIN (ANALYZE,  BUFFERS) SELECT b FROM r WHERE c>15;
ROLLBACK;

\echo ---------------- Question 4: ABIS-b-c plan
SET enable_seqscan = OFF;
SET enable_bitmapscan = ON;
SET enable_indexonlyscan = OFF;
SET enable_indexscan = OFF;
BEGIN;
DROP index cb_idx;
EXPLAIN (ANALYZE,  BUFFERS) SELECT * FROM r WHERE b=9 AND c=10;
ROLLBACK;

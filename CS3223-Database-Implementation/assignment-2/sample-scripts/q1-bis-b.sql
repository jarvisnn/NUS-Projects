\echo ---------------- Question 1: BIS-b plan
SET enable_seqscan = OFF;
SET enable_bitmapscan = ON;
SET enable_indexonlyscan = OFF;
SET enable_indexscan = OFF;
EXPLAIN (ANALYZE,  BUFFERS) SELECT * FROM r WHERE b=9;

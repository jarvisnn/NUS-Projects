\echo ---------------- Question 3: BIS-c plan
SET enable_seqscan = OFF;
SET enable_bitmapscan = ON;
SET enable_indexonlyscan = OFF;
SET enable_indexscan = OFF;
EXPLAIN (ANALYZE,  BUFFERS) SELECT b FROM r WHERE c>15;

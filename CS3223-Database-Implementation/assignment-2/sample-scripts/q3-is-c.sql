\echo ---------------- Question 3: IS-c plan
SET enable_seqscan = OFF;
SET enable_bitmapscan = OFF;
SET enable_indexonlyscan = OFF;
SET enable_indexscan = ON;
EXPLAIN (ANALYZE,  BUFFERS) SELECT b FROM r WHERE c>15;

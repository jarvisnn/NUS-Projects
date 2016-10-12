\echo ---------------- Question 6: SS
SET enable_seqscan = ON;
SET enable_bitmapscan = OFF;
SET enable_indexonlyscan = OFF;
SET enable_indexscan = OFF;
EXPLAIN (ANALYZE,  BUFFERS) SELECT * FROM r WHERE b>9 AND c=10;

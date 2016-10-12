CS3223 Assignment 1
=======================================

* Team C: Nguyen Viet Dung (A0112068N) + Tran Manh(A0112058)


Notes
---------
* All the changes will be started with a comment of "cs3223 team-c".
* There is no change on **bufmgr.c**, all are done under **freelist-lru.c**.


LRU
---------
We implement a double linked-list for storing used buffers.
Key changes:

* Add **listFront** and **listBack** to **BufferStrategyControl** for keeping
tracks of head and tail of the double linked-list.
```C
  int			 listFront;  // head of the LRU List
  int			 listBack;   // tail of the LRU List
```

* Implement a new type of the list entry. Each entry need a **buf_id** for
buffer identification, a **next** to link to the next entry and a **prev** to
link to the previous entry in the list.
```C
typedef struct {
 	int		buf_id;
 	int		next;
 	int		prev;
} ListEntry;
```

* This method is to update when some buffer is accessed / deleted.
```C
void StrategyUpdateAccessedBuffer(int buf_id, bool delete)
```

* Get a candidate buffer. Remove all the code related to **Clock** and replace
it with **LRU Algorithm**. Then update the selected buffer in the linked list.
```C
volatile BufferDesc *StrategyGetBuffer(BufferAccessStrategy strategy, bool *lock_held)
```

* Addition to free a buffer, we remove it from the linked-list.
```C
void StrategyFreeBuffer(volatile BufferDesc *buf)
```

* Add size of the linked-list.
```C
Size StrategyShmemSize(void) {
 	size = add_size(size, mul_size(NBuffers, sizeof(ListEntry)));
}
```

* Initialize the linked-list and list entries.
```C
void StrategyInitialize(bool init)
```


LRU2
---------
Basically **LRU2** is quite the same as **LRU** about the structure of the code.
So we only mention the main differences between **LRU** and **LRU2**

* Additional fields to **BufferStrategyControl**. As now we have 2 list, list 1
is for 1-time-accessed buffers, and list 2 is for buffers that have more than 1
time accessed. **timeCount** is to calculate the time. We can use real time here,
but for simplicity, we just make it a variable.
```C
int			 list1Front;  // head of the LRU List 1 of 1-time accessed buffers
int			 list1Back;   // tail of the LRU List 1 of 1-time accessed buffers
int			 list2Front;  // head of the LRU List 2 of >=2-times accessed buffers
int			 list2Back;   // tail of the LRU List 2 of >=2-times accessed buffers
int			 timeCount;   // time count for accessing buffers
```

* **ListEntry** now need to keep tracks of the accessed time.
```C
typedef struct {
 	int		buf_id;
 	int		next;
 	int		prev;
 	int		lastAccessedTime;
 	int		secondLastAccessedTime;
} ListEntry;
```

* All the main changes of algorithm is inside these 2 functions. The rest
have only minor changes to fulfill LRU2.
```C
void StrategyUpdateAccessedBuffer(int buf_id, bool delete)
volatile BufferDesc *StrategyGetBuffer(BufferAccessStrategy strategy, bool *lock_held)
```


Observation
---------
We observe from the performances of the 3 algorithms:

* Latency average: Clock < LRU < LRU2.
* Transactions per second: Clock > LRU > LRU2.
* Heap Hit Ratio: Clock > LRU >> LRU2.
* From here we can see that Clock Algorithm makes a slightly better performance
than LRU Algorithm. LRU2 Algorithm is significantly worse than the rest.
* This means Clock run fastest in this test case. This may due to the test does
not touch the recent buffer much (this makes the advantage of LRU). And LRU2 needs
more specific test cases for its advantage.

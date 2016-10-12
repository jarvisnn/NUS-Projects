CPP=gcc
OPTS=-g -Wall
LIBS=-lresolv -ldl -lm

# Modify PSQLPATH to replace with your own account id !
PSQLPATH=/home/n/nvdung/postgresql-9.4.5

INCLUDE=-I$(PSQLPATH)/src/include     

freelist-lru.o: freelist-lru.c
	$(CPP) $(OPTS) $(INCLUDE) -c -o freelist-lru.o freelist-lru.c

freelist-lru2.o: freelist-lru2.c
	$(CPP) $(OPTS) $(INCLUDE) -c -o freelist-lru2.o freelist-lru2.c

clean:
	rm -f *.o

lru: copylru pgsql

lru2: copylru2 pgsql

clock: copyclock pgsql

copylru:
	cp freelist-lru.c $(PSQLPATH)/src/backend/storage/buffer/freelist.c
	cp bufmgr.c $(PSQLPATH)/src/backend/storage/buffer/bufmgr.c

copylru2:
	cp freelist-lru2.c $(PSQLPATH)/src/backend/storage/buffer/freelist.c
	cp bufmgr.c $(PSQLPATH)/src/backend/storage/buffer/bufmgr.c

copyclock:
	cp freelist.original.c $(PSQLPATH)/src/backend/storage/buffer/freelist.c
	cp bufmgr.original.c $(PSQLPATH)/src/backend/storage/buffer/bufmgr.c

pgsql:
	cd $(PSQLPATH) && make && make install


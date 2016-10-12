#!/usr/bin/env bash

chmod u+x ~/assign1/*.sh

# install pgbench program
cd ~/postgresql-9.4.5/contrib/pgbench
make && make install 

# install test_bufmgr extension
if [ ! -d ~/postgresql-9.4.5/contrib/test_bufmgr ]; then
	cp -r ~/assign1/test_bufmgr ~/postgresql-9.4.5/contrib
	cd ~/postgresql-9.4.5/contrib/test_bufmgr
	make && make install 
fi

# create database cluster in local disk /temp if running on compute cluster; otherwise database cluster is in $HOME
# PGDATA variable is updated in .bash_profile
if [ -d /temp ]; then
	if [ ! -d /temp/pgdata-teamc ]; then
		mkdir /temp/pgdata-teamc
		initdb -D /temp/pgdata-teamc
	fi
	cat >> ~/.bash_profile <<EOF
export PGDATA=/temp/pgdata-teamc
EOF
else
	if [ ! -d $HOME/pgdata-teamc ]; then
		mkdir $HOME/pgdata-teamc
		initdb -D $HOME/pgdata-teamc
	fi
	cat >> ~/.bash_profile <<EOF
export PGDATA=\$HOME/pgdata-teamc
EOF
fi



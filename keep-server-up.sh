#!/bin/bash


# Dumb simple script to try to keep server alive...

while :; do
	instances=$(ps aux | grep -c app.js)
	# grep, supervisor
	if [ $instances -lt 3 ]; then
		# TODO: echos should also be piped to deploy.log as well (currently nohup.out)
		echo $(date)
		echo "uh oh, restarting supervisor..."
		make start >> deploy.log
	fi
	sleep 120
done

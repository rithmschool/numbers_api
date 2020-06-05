all: local

# TODO: Get node to recognize node_path is /usr/local/lib/node_modules

# Run a local node.js server for development
local: compass
	compass watch --trace public/ &
	NODE_PATH=/usr/local/lib/node_modules nodemon app.js

# Compiles compass
compass:
	compass clean public/
	compass compile public/

# Stops any running node server
stop:	
	sudo pkill node || true
	npm run stop

# Starts a production node server
# TODO: Should use a deamon that monitors this process and automatically starts
# 		on crash/reboot.
start: stop
	npm run start-prod &

# Transfer files to the server
transfer: compass
	rsync -avz --exclude .git --exclude logs/ --exclude suggestions.json --stats --progress . numbers:~/www

# Deploy to the server: transfer files and restart node production server
# See: http://stackoverflow.com/questions/29142/getting-ssh-to-execute-a-command-in-the-background-on-target-machine
deploy: transfer
	ssh numbers 'cd /home/numbers/www && nohup make start &>> deploy.log < /dev/null &'
	ssh numbers 'tail -n 200 /home/numbers/www/deploy.log'

# Dump all facts data to files
dump:
	NODE_PATH=/usr/local/lib/node_modules node app.js --dump

count:
	@grep -c '[a-zA-Z]' facts-dump/*.txt
	@grep '[a-zA-Z]' facts-dump/*.txt | wc -l

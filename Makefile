all: local

# TODO: Get node to recognize node_path is /usr/local/lib/node_modules

# Run a local node.js server for development
local:
	compass watch --trace public/ &
	NODE_PATH=/usr/local/lib/node_modules nodemon app.js

# Compiles compass
compass:
	compass compile public/

# Stops any running node server
stop:
	sudo pkill node || true

# Starts a production node server
# TODO: Should use a deamon that monitors this process and automatically starts
# 		on crash/reboot.
start: stop
	NODE_PATH=/usr/local/lib/node_modules NODE_ENV=production nohup node app.js &

# Transfer files to the server
transfer: compass
	rsync -avz --exclude .git --stats --progress . numbers@david-hu.com:~/www

# Deploy to the server: transfer files and restart node production server
# See: http://stackoverflow.com/questions/29142/getting-ssh-to-execute-a-command-in-the-background-on-target-machine
deploy: transfer
	ssh numbers@david-hu.com 'cd /home/numbers/www && nohup make start &> deploy.log < /dev/null &'
	ssh numbers@david-hu.com 'cat /home/numbers/www/deploy.log'

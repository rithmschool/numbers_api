all: local

# Run a local node.js server for development
local:
	compass watch public/ &
	nodemon app.js

# Compiles compass
compass:
	compass compile public/

# Stops any running node server
stop:
	sudo pkill node

# Starts a production node server
start: stop
	NODE_ENV=production nohup node app.js &

# Transfer files to the server
transfer: compass
	rsync -avz --exclude .git --stats --progress . numbers@david-hu.com:~/www

# Deploy to the server: transfer files and restart node production server
# See: http://stackoverflow.com/questions/29142/getting-ssh-to-execute-a-command-in-the-background-on-target-machine
deploy: transfer
	ssh numbers@david-hu.com 'cd /home/numbers/www && nohup make start &> deploy.log < /dev/null &'
	ssh numbers@david-hu.com 'cat /home/numbers/www/deploy.log'

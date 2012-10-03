#!/bin/sh

# This sets up Numbers API on EC2 Ubuntu11 AMI.
#
# Idempotent.
#
# This can be run like
#
# $ cat setup.sh | ssh <hostname of EC2 machine> sh
#
# ./create_role_account.sh numbers | ssh -i KEYFILE ubuntu@IP_ADDRESS sh
#
# to create the "numbers" user account.


# Bail on any errors
set -e

CONFIG_DIR=$HOME/numbers_api/aws_setup

cd $HOME

sudo apt-get update

echo "Installing developer tools"
sudo apt-get install -y curl
sudo apt-get install -y python-pip
sudo apt-get install -y build-essential python-dev
sudo apt-get install -y git
sudo apt-get install -y unzip
sudo apt-get install -y ruby rubygems
sudo REALLY_GEM_UPDATE_SYSTEM=1 gem update --system

echo "Installing node and npm"
cd /tmp
wget http://nodejs.org/dist/v0.8.11/node-v0.8.11.tar.gz
tar xzf node-v0.8.11.tar.gz
( cd node-v0.8.11 && ./configure && make && make install )
cd $HOME
curl https://npmjs.org/install.sh | sudo sh
sudo npm install -g supervisor

echo "Setting up numbers API code base and deps"
git clone https://github.com/mduan/numbers_api.git || ( cd numbers_api && git pull )
sudo apt-get install -y pkg-config
sudo gem install compass
sudo gem install bundle
cd numbers_api
bundle install
npm install
cd $HOME

echo "Installing nginx"
sudo apt-get install -y nginx
sudo rm -f /etc/nginx/sites-enabled/default
sudo ln -sfnv $CONFIG_DIR/etc/nginx/sites-available/numbers_api \
  /etc/nginx/sites-available/numbers_api
sudo ln -sfnv /etc/nginx/sites-available/numbers_api /etc/nginx/sites-enabled/numbers_api
sudo service nginx restart

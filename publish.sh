#!/bin/sh

git push ec2 && ssh -tt numbers@david-hu.com 'cd /home/numbers/www && sudo ./runserver.sh'

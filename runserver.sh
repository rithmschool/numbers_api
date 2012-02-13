#!/bin/sh

compass compile public/sass/

sudo pkill node
(NODE_ENV=production node app.js &)

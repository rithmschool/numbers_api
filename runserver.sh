#!/bin/sh

sudo pkill node
(NODE_ENV=production node app.js &)


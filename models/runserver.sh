#!/bin/sh

pkill node
NODE_ENV=production node app.js

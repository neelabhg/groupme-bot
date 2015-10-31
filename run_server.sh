#!/bin/sh
# Script to run the server. Should be run from the project's root directory.

# Get latest code from repository (optional, comment out if not needed)
git pull

# Install/update dependencies
npm install

# Create the logs/ directory
mkdir -p -v logs/

# Start the server. The default port used is 5000. If you want to use another port,
# set the PORT environment variable to the desired port number.
#
# nohup is used to keep the process running even after the terminal/ssh session is closed.
#
# Any non-error output (including console.log) will be output in logs/server-stdout.txt,
# and errors will be output in logs/server-stderr.txt
nohup node src/index.js 1> logs/server-stdout.txt 2> logs/server-stderr.txt &

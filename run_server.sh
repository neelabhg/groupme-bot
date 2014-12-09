# Script to run the server on my AWS Linux instance
# Uses nohup to keep the process running even after the ssh session is closed
#!/bin/sh
npm install
nohup node src/index.js 1> logs/server-stdout.txt 2> logs/server-stderr.txt &

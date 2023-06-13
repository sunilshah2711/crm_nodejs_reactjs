#!/bin/bash

# Go to app folder
cd /home/ubuntu/podamium-backend

#install typescript dependency
./node_modules/.bin/pm2 install typescript
sudo aws --region us-east-2 s3 cp "s3://podamium-secret/prod.env" ".env"
# start again
./node_modules/.bin/pm2 start src/index.ts --watch

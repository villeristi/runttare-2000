#!/usr/bin/env bash

docker build ./nginx -t runttare_nginx --no-cache && docker run -d -p 80:80 -v `pwd`/ui/dist:/app  runttare_nginx:latest

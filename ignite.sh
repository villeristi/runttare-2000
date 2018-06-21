#!/usr/bin/env bash

# Lé Docker magig'n shit

set -ex \
    docker build ./nginx -t runttare_nginx --no-cache &&  \
    docker build ./api -t runttare_api --no-cache &&  \
    docker run -d -p 80:80 -v `pwd`/ui/dist:/app runttare_nginx:latest && \
    docker run -d -p 3001:3001 runttare_api:latest

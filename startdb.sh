#!/usr/bin/env bash

# This script will do the following job:
# 1. Pull mongo image if not exists
# 2. Start a container with mongo image, and remove it right after it stops

if [[ "$(docker images -q mongo 2> /dev/null)" == "" ]]; then
    docker pull mongo
fi

if [[ "$(docker ps -a | grep webapp_database)" == "" ]]; then
    docker run --rm --name webapp_database -d -p 27017:27017  mongo
    echo Mongo container[webapp_database] started at port 27017
else
    echo Mongo container[webapp_database] already running at port 27017
fi

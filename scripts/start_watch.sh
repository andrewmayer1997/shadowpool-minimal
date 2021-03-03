#!/bin/bash

source .env

mkdir -p $LOGDIR

nohup node dist/watch.js >$LOGDIR/watch.log 2>&1 &
disown

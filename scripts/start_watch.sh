#!/bin/bash

source .env

mkdir -p $LOGDIR

#nohup node dist/watch.js >$LOGDIR/watch.log 2>&1 &
#disown
TOKEN="1643667819:AAFjB82QKOC-3ZcxUAlWmKWua9l5g4Ygi_k" & node dist/watch.js
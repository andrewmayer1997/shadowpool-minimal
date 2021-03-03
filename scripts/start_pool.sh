#!/bin/bash

source .env

mkdir -p $LOGDIR

nohup node build/shadowpool.js >$LOGDIR/shadow.log 2>&1 & disown

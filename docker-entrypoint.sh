#!/bin/sh
# Force unbuffered output for real-time logs
exec node server.js 2>&1

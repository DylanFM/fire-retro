#!/bin/bash

# the flag tells bash to exit if a command fails
set -e

# Copy the config across
cp src/scripts/config.js{.example,}

npm install

npm run phantom

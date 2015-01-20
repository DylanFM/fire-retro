#!/bin/bash

# the flag tells bash to exit if a command fails
set -e

env

npm install

npm run phantom

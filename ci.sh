#!/bin/bash
set -e

# If the CI env variable is empty, exit
if [[ ! -n $CI ]] ; then exit ; fi

# Copy the config across
cp src/scripts/config.js{.example,}

npm run phantom

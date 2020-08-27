#!/usr/bin/env bash

set -e

# TODO: set env for docker-machine in Windows and OSX


# export docker-machine IP
IP=127.0.0.1
unamestr=`uname`
if [[ "$unamestr" != 'Linux' ]]; then
  # Set docker-machine IP
  IP="$(docker-machine ip)"
fi
export EXTERNAL_IP=$IP

# Get this script directory (to find yml from any directory)
export DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Stop
docker-compose -f $DIR/docker-compose.yml stop

# Start container
docker-compose -f $DIR/docker-compose.yml up
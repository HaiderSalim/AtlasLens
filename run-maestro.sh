#!/usr/bin/env bash
export JAVA_HOME="/usr/lib/jvm/java-25-openjdk"
export JAVA_OPTS="-Duser.home=/tmp"
export HOME="/tmp"
export MAESTRO_CLI_NO_ANALYTICS=true
export PATH="/mnt/Hard_drive/HDD Primary Storage/Projects/Apps/.platform-tools/platform-tools:/mnt/Hard_drive/HDD Primary Storage/Projects/Apps/.maestro/bin:$PATH"

maestro "$@"


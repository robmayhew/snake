#!/usr/bin/env bash

tsc --outfile html/bundle.js src/main.ts
# The directory to monitor
DIR_TO_MONITOR="src"

# The command to run on file changes
COMMAND_TO_RUN="tsc --outfile html/bundle.js src/main.ts"

# Ensure fswatch is installed
if ! command -v fswatch &> /dev/null; then
    echo "fswatch could not be found. Please install it using 'brew install fswatch'."
    exit 1
fi

# Monitor the directory for changes
fswatch -o "$DIR_TO_MONITOR" |
while read -r change; do
    echo "File change detected"
    $COMMAND_TO_RUN
done


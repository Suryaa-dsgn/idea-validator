#!/bin/bash
echo "========== RENDER STARTUP SCRIPT =========="
echo "Current directory: $(pwd)"
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Set the PORT explicitly
export PORT=10000
echo "Setting PORT=$PORT"

# Check if our simple render start file exists
if [[ -f render-start.js ]]; then
  echo "Using render-start.js file"
  node render-start.js
else
  echo "render-start.js not found, using server.js"
  if [[ -f server.js ]]; then
    node server.js
  else
    echo "ERROR: No server file found!"
    echo "Directory contents:"
    ls -la
    exit 1
  fi
fi 
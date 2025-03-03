#!/bin/bash
set -e

echo "======================================================"
echo "Starting simple JavaScript deployment process..."
echo "======================================================"

# Install dependencies
echo "Installing dependencies..."
npm install

# Skip TypeScript build entirely and use the simple JavaScript server
echo "Using simple JavaScript server for deployment..."

# Create .env file if it doesn't exist
echo "Ensuring .env file exists..."
if [ ! -f .env ]; then
  echo "Creating .env file with default values..."
  
  # Explicitly set PORT to 10000 for Render
  echo "PORT=10000" > .env
  echo "NODE_ENV=production" >> .env
  
  # The actual connection string should be set in Render's environment variables
  if [ -z "$MONGODB_URI" ]; then
    echo "WARNING: MONGODB_URI is not set in environment variables!"
    echo "MONGODB_URI=mongodb+srv://placeholder:placeholder@cluster0.mongodb.net/placeholder" >> .env
  else
    echo "MONGODB_URI environment variable detected."
    echo "MONGODB_URI=$MONGODB_URI" >> .env
  fi
fi

# Print environment for troubleshooting
echo "======================================================"
echo "DEPLOYMENT ENVIRONMENT INFORMATION:"
echo "======================================================"
echo "Current directory: $(pwd)"
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"
echo "OS information: $(uname -a)"
echo "PORT setting in .env: $(grep PORT .env)"

# Check if server.js exists
if [ -f server.js ]; then
  echo "server.js found ✅"
else
  echo "ERROR: server.js not found! ❌"
  echo "Current directory contains: $(ls -la)"
  exit 1
fi

echo "======================================================"
echo "Starting server with explicit port setting..."
echo "======================================================"

# Force the PORT to be set to 10000 for Render
export PORT=10000
echo "Forcing PORT to be $PORT"

# Start the application with increased logging
NODE_DEBUG=http,net node server.js 
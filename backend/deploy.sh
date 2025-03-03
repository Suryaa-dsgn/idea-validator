#!/bin/bash
set -e

echo "Starting simple JavaScript deployment process..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Skip TypeScript build entirely and use the simple JavaScript server
echo "Using simple JavaScript server for deployment..."

# Create .env file if it doesn't exist
echo "Ensuring .env file exists..."
if [ ! -f .env ]; then
  echo "Creating .env file with default values..."
  # Render automatically injects PORT env variable, but let's make sure we have a fallback
  # If PORT is set, use it, otherwise default to 10000 (Render's preferred port)
  echo "PORT=${PORT:-10000}" > .env
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

echo "Environment information:"
echo "PORT: ${PORT:-10000}"
echo "NODE_ENV: production"

echo "Build process completed, starting the application..."

# Make sure the PORT environment variable is defined when starting the application
export PORT=${PORT:-10000}
echo "Starting server on PORT $PORT"

# Start the application using the simple JavaScript file
node server.js 
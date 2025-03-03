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
  echo "PORT=8080" > .env
  echo "NODE_ENV=production" >> .env
  # The actual connection string should be set in Render's environment variables
  echo "MONGODB_URI=mongodb+srv://placeholder:placeholder@cluster0.mongodb.net/placeholder" >> .env
fi

echo "Build process completed, starting the application..."

# Start the application using the simple JavaScript file
node server.js 
#!/bin/bash
set -e

echo "Starting deployment process..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Run our custom build script
echo "Running custom build script..."
node render-build.js

# Ensure the dist directory exists, even if above failed
mkdir -p dist

# Manually copy package.json to dist
echo "Copying package.json to dist..."
cp package.json dist/

# Ensure we're in the correct directory
cd dist

# Install production dependencies
echo "Installing production dependencies in dist directory..."
npm install --only=production

# Move back to main directory
cd ..

echo "Build process completed, starting the application..."

# Start the application
npm start 
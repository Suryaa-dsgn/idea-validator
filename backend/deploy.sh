#!/bin/bash

# Install dependencies
npm install

# Try building with babel (JavaScript approach)
echo "Attempting to build with babel..."
npm run build-js

# Start the application
npm start 
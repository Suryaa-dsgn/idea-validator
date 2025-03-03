// Simple Express server for deployment on Render
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Create Express app
const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    // Don't exit on MongoDB connection error in production
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
};

// Basic routes - Adding more explicit routes for testing
app.get('/', (req, res) => {
  res.status(200).send(`
    <html>
      <head><title>Idea Validator API</title></head>
      <body>
        <h1>Idea Validator API is running</h1>
        <p>Server is running on port: ${PORT}</p>
        <p>Environment: ${process.env.NODE_ENV}</p>
        <p>Current time: ${new Date().toISOString()}</p>
      </body>
    </html>
  `);
});

// Very simple route that Render can easily detect
app.get('/render-test', (req, res) => {
  res.status(200).send('OK');
});

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    environment: process.env.NODE_ENV,
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Idea Validator API',
    version: '1.0.0'
  });
});

// Catch-all route
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server - more verbose logging
const startServer = async () => {
  try {
    // Try to connect to MongoDB but don't wait for it in production
    if (process.env.NODE_ENV === 'production') {
      connectDB().catch(err => console.error('MongoDB connection error:', err.message));
    } else {
      await connectDB();
    }
    
    // Log pre-start information
    console.log(`About to start server on port ${PORT}`);
    console.log(`Binding to address: 0.0.0.0`);
    
    // Explicitly bind to 0.0.0.0 to listen on all network interfaces
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ SERVER STARTED SUCCESSFULLY`);
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`✅ Server environment: ${process.env.NODE_ENV}`);
      console.log(`✅ Server listening on: http://localhost:${PORT}`);
      console.log(`✅ Health check endpoint: http://localhost:${PORT}/health`);
      console.log(`✅ Render test endpoint: http://localhost:${PORT}/render-test`);
    });
    
    // Add server error handling
    server.on('error', (error) => {
      console.error('SERVER ERROR:', error);
      if (error.code === 'EADDRINUSE') {
        console.error(`⛔ Port ${PORT} is already in use!`);
      }
    });
  } catch (error) {
    console.error('⛔ CRITICAL ERROR - Failed to start server:', error.message);
    process.exit(1);
  }
};

// Log environment information
console.log('🚀 Starting Idea Validator API server');
console.log(`📋 NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`📋 PORT: ${PORT}`);
console.log(`📋 MONGODB_URI: ${process.env.MONGODB_URI ? '(set)' : '(not set)'}`);

// Process event handlers
process.on('uncaughtException', (error) => {
  console.error('⛔ UNCAUGHT EXCEPTION:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('⛔ UNHANDLED REJECTION:', reason);
});

// Start the server
startServer(); 
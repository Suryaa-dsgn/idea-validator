/**
 * RENDER STARTUP FILE
 * This is an extremely simplified server that does nothing but bind to port 10000
 * It's designed to be easy for Render to detect during deployment
 */

const http = require('http');
const PORT = process.env.PORT || 10000;

// Create the simplest possible server
const server = http.createServer((req, res) => {
  // Log all incoming requests
  console.log(`[${new Date().toISOString()}] Request received: ${req.method} ${req.url}`);
  
  // Simple response for all routes
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Idea Validator API is running\n');
});

// Bind to all interfaces (0.0.0.0) on specified port
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is listening on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Server time: ${new Date().toISOString()}`);
});

// Log any server errors
server.on('error', (error) => {
  console.error('SERVER ERROR:', error.message);
  
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use!`);
  }
});

// Keep process running
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
  });
});

// Log to show this file is being executed
console.log('='.repeat(50));
console.log('RENDER START FILE EXECUTED');
console.log(`DATE: ${new Date().toISOString()}`);
console.log(`PORT: ${PORT}`);
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
console.log('='.repeat(50)); 
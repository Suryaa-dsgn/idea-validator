// This file helps Render detect the port configuration
const http = require('http');

// Log port configuration for Render
console.log('⭐ Render buildtime - PORT configured to:', process.env.PORT || '10000');

// Create a simple HTTP server that listens on the PORT
// This is ONLY for build-time detection by Render
const PORT = process.env.PORT || 10000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Render buildtime detector is active\n');
});

// Listen on the port but then close it immediately
// This is just to register the port with Render's detection system
server.listen(PORT, '0.0.0.0', () => {
  console.log(`⭐ Render buildtime detector listening on port ${PORT}`);
  
  // Close after 2 seconds to allow Render to detect it
  setTimeout(() => {
    server.close(() => {
      console.log('⭐ Render buildtime detector closed');
    });
  }, 2000);
});

// Handle server errors
server.on('error', (error) => {
  console.error('⭐ Render buildtime detector error:', error.message);
}); 
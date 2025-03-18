/**
 * server.js
 * A simple Express server to serve both the static site and React app in development
 */

const express = require('express');
const path = require('path');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const API_PORT = process.env.API_PORT || 3001;

// Enable CORS
app.use(cors());

// Define auth routes that should go to React app
const reactRoutes = ['/login', '/signup', '/dashboard', '/forgot-password'];

// Serve static files from root directory (for main site)
app.use(express.static(path.join(__dirname)));

// Check if React build directory exists
const reactBuildPath = path.join(__dirname, 'frontend/build');
const reactIndexPath = path.join(reactBuildPath, 'index.html');

// Log the path being used
console.log('React build path:', reactBuildPath);

// Proxy API requests to the backend server
app.use('/api', createProxyMiddleware({ 
  target: `http://localhost:${API_PORT}`,
  changeOrigin: true,
}));

// Serve React app static files
app.use(express.static(reactBuildPath));

// Explicitly handle the root path to serve the static site index.html
app.get('/', (req, res) => {
  console.log('Serving static site homepage');
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle direct routes to React auth pages
reactRoutes.forEach(route => {
  app.get(route, (req, res) => {
    console.log(`Serving React route: ${route}`);
    if (fs.existsSync(reactIndexPath)) {
      res.sendFile(reactIndexPath);
    } else {
      res.status(404).send('React app not built. Please run: cd frontend && npm run build');
    }
  });
});

// For React sub-routes
app.get(['/login/*', '/signup/*', '/dashboard/*', '/forgot-password/*'], (req, res) => {
  console.log(`Serving React sub-route: ${req.path}`);
  if (fs.existsSync(reactIndexPath)) {
    res.sendFile(reactIndexPath);
  } else {
    res.status(404).send('React app not built. Please run: cd frontend && npm run build');
  }
});

// All other routes go to the static site's index.html
app.get('*', (req, res) => {
  // Check if path contains a dot (likely a file)
  if (req.path.indexOf('.') !== -1) {
    // Let express.static handle it
    res.status(404).send('File not found');
    return;
  }
  
  console.log(`Serving static site for: ${req.path}`);
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Static site at http://localhost:${PORT}`);
  console.log(`React auth app available at routes: ${reactRoutes.join(', ')}`);
  console.log(`API proxied to http://localhost:${API_PORT}/api`);
}); 
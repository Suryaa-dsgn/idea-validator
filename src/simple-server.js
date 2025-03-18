/**
 * simplified-server.js
 * A simple Express server with auth endpoints that work without TypeScript or MongoDB
 */

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

// Create Express app
const app = express();
const PORT = process.env.API_PORT || 3001;
const JWT_SECRET = 'dev-jwt-secret-12345';

// Enable CORS and parse JSON
app.use(cors());
app.use(bodyParser.json());

// Mock DB for users
const users = [];

// Auth Routes
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    console.log('Registration attempt:', { name, email });
    
    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Email already in use'
      });
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password, // In real app, would hash the password
      role: 'user',
      createdAt: new Date().toISOString()
    };
    
    // Add to our mock DB
    users.push(newUser);
    console.log('Created user:', newUser);
    
    // Generate token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    
    res.status(201).json({
      success: true,
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during registration'
    });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt:', { email });
    
    // Find user
    const user = users.find(u => u.email === email);
    
    // Check if user exists and password matches
    if (!user || user.password !== password) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
    
    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    
    console.log('Login successful for:', email);
    
    res.status(200).json({
      success: true,
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during login'
    });
  }
});

// Middleware to check JWT
const protect = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.split(' ')[1] 
      : null;
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized'
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Add user to request
    const user = users.find(u => u.id === decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found'
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({
      success: false,
      error: 'Not authorized'
    });
  }
};

app.get('/api/auth/me', protect, (req, res) => {
  // Return user from request (set by protect middleware)
  const { password, ...userWithoutPassword } = req.user;
  
  res.status(200).json({
    success: true,
    data: userWithoutPassword
  });
});

app.get('/api/auth/logout', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Successfully logged out'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    environment: 'development',
    timestamp: new Date().toISOString(),
  });
});

// 404 for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API route not found',
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
  console.log('Registered users:', users.length);
}); 
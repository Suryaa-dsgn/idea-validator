// Netlify serverless function for API
const express = require('express');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');

// Create express app
const app = express();
const router = express.Router();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// JWT Secret (should be in env variables for production)
const JWT_SECRET = 'your-jwt-secret-key';

// Mock database (in-memory for this demo)
let users = [
  {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    password: '$2a$10$zN44uzm9bm2xeghQlxXnB.C6NqTAbnNzJXpzSMI.cQQYnQTLi1gn.' // "password123"
  }
];

let ideas = [];

// Auth routes
router.post('/auth/register', (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'User already exists' 
      });
    }
    
    // In a real app, we would hash the password
    // For demo, adding user directly
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password
    };
    
    users.push(newUser);
    
    // Create token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Server error'
    });
  }
});

router.post('/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = users.find(user => user.email === email);
    if (!user) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }
    
    // In a real app, we would verify password hash
    // For demo, simple comparison
    if (user.password !== password) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }
    
    // Create token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Server error'
    });
  }
});

// Middleware to check JWT token
const auth = (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'No token, authorization denied' 
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false,
      message: 'Token is not valid' 
    });
  }
};

// Ideas routes - protected by auth middleware
router.post('/ideas', auth, (req, res) => {
  try {
    const { title, description, category } = req.body;
    
    const newIdea = {
      id: Date.now().toString(),
      title,
      description,
      category,
      user: req.user.id,
      createdAt: new Date().toISOString()
    };
    
    ideas.push(newIdea);
    
    res.status(201).json({
      success: true,
      data: newIdea
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Server error'
    });
  }
});

router.get('/ideas', auth, (req, res) => {
  try {
    const userIdeas = ideas.filter(idea => idea.user === req.user.id);
    
    res.status(200).json({
      success: true,
      count: userIdeas.length,
      data: userIdeas
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Server error'
    });
  }
});

// Base route for testing
router.get('/', (req, res) => {
  res.json({
    message: 'Idea Validator API is running'
  });
});

// Use router
app.use('/.netlify/functions/api', router);

// Export handler for serverless
module.exports.handler = serverless(app); 
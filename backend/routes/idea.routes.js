const express = require('express');
const router = express.Router();
const Idea = require('../models/idea.model');
const { protect } = require('../middleware/auth.middleware');

// @route   GET /api/ideas
// @desc    Get all ideas for the current user
// @access  Private
router.get('/', protect, async (req, res, next) => {
  try {
    const ideas = await Idea.find({ user: req.user.id }).sort('-createdAt');
    
    res.status(200).json({
      success: true,
      count: ideas.length,
      data: ideas
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/ideas/:id
// @desc    Get single idea
// @access  Private
router.get('/:id', protect, async (req, res, next) => {
  try {
    const idea = await Idea.findById(req.params.id);
    
    if (!idea) {
      return res.status(404).json({
        success: false,
        error: 'Idea not found'
      });
    }
    
    // Make sure user owns the idea
    if (idea.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this idea'
      });
    }
    
    res.status(200).json({
      success: true,
      data: idea
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/ideas
// @desc    Create new idea
// @access  Private
router.post('/', protect, async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;
    
    const idea = await Idea.create(req.body);
    
    res.status(201).json({
      success: true,
      data: idea
    });
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/ideas/:id
// @desc    Update idea
// @access  Private
router.put('/:id', protect, async (req, res, next) => {
  try {
    let idea = await Idea.findById(req.params.id);
    
    if (!idea) {
      return res.status(404).json({
        success: false,
        error: 'Idea not found'
      });
    }
    
    // Make sure user owns the idea
    if (idea.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this idea'
      });
    }
    
    idea = await Idea.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: idea
    });
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/ideas/:id
// @desc    Delete idea
// @access  Private
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const idea = await Idea.findById(req.params.id);
    
    if (!idea) {
      return res.status(404).json({
        success: false,
        error: 'Idea not found'
      });
    }
    
    // Make sure user owns the idea
    if (idea.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this idea'
      });
    }
    
    await idea.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/ideas/:id/validate
// @desc    Validate an idea
// @access  Private
router.post('/:id/validate', protect, async (req, res, next) => {
  try {
    const idea = await Idea.findById(req.params.id);
    
    if (!idea) {
      return res.status(404).json({
        success: false,
        error: 'Idea not found'
      });
    }
    
    // Make sure user owns the idea
    if (idea.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to validate this idea'
      });
    }
    
    // Here you would call your AI service to validate the idea
    // For now, we'll use mock data
    const validation = {
      marketViability: {
        score: Math.floor(Math.random() * 100),
        feedback: "This is market viability feedback"
      },
      technicalFeasibility: {
        score: Math.floor(Math.random() * 100),
        feedback: "This is technical feasibility feedback"
      },
      competitiveLandscape: {
        score: Math.floor(Math.random() * 100),
        feedback: "This is competitive landscape feedback"
      },
      userDemand: {
        score: Math.floor(Math.random() * 100),
        feedback: "This is user demand feedback"
      },
      overallScore: Math.floor(Math.random() * 100),
      recommendations: [
        "First recommendation",
        "Second recommendation",
        "Third recommendation"
      ],
      strengthsAndWeaknesses: {
        strengths: ["Strength 1", "Strength 2", "Strength 3"],
        weaknesses: ["Weakness 1", "Weakness 2", "Weakness 3"]
      },
      validatedAt: Date.now()
    };
    
    // If idea already has a validation, store it in history
    if (idea.validation) {
      if (!idea.validationHistory) {
        idea.validationHistory = [];
      }
      idea.validationHistory.push(idea.validation);
    }
    
    // Update idea with new validation
    idea.validation = validation;
    idea.status = 'validated';
    
    await idea.save();
    
    res.status(200).json({
      success: true,
      data: idea
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router; 
const mongoose = require('mongoose');

// Define validation metric schema
const ValidationMetricSchema = new mongoose.Schema({
  score: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  feedback: {
    type: String,
    required: true
  }
});

// Define validation schema
const ValidationSchema = new mongoose.Schema({
  marketViability: ValidationMetricSchema,
  technicalFeasibility: ValidationMetricSchema,
  competitiveLandscape: ValidationMetricSchema,
  userDemand: ValidationMetricSchema,
  overallScore: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  recommendations: [String],
  strengthsAndWeaknesses: {
    strengths: [String],
    weaknesses: [String]
  },
  validatedAt: {
    type: Date,
    default: Date.now
  }
});

// Define idea schema
const IdeaSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: [
      'Technology',
      'Healthcare',
      'Finance',
      'Education',
      'E-commerce',
      'Food & Beverage',
      'Entertainment',
      'Transportation',
      'Real Estate',
      'Social Media',
      'Other'
    ]
  },
  targetAudience: {
    type: [String],
    required: [true, 'Please define your target audience']
  },
  problem: {
    type: String,
    maxlength: [500, 'Problem statement cannot be more than 500 characters']
  },
  solution: {
    type: String,
    maxlength: [500, 'Solution cannot be more than 500 characters']
  },
  revenueModel: {
    type: String,
    maxlength: [300, 'Revenue model cannot be more than 300 characters']
  },
  competitiveAdvantage: {
    type: String,
    maxlength: [500, 'Competitive advantage cannot be more than 500 characters']
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'validated', 'archived'],
    default: 'draft'
  },
  validation: ValidationSchema,
  validationHistory: [ValidationSchema]
}, {
  timestamps: true
});

// Create text index for searching
IdeaSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Idea', IdeaSchema); 
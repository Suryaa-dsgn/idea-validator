import { Request, Response, NextFunction } from 'express';
import Idea from '../models/idea';
import { AIService } from '../services/aiService';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import mongoose from 'mongoose';
import { emailService } from '../utils/emailService';
import User from '../models/user';

/**
 * @desc    Get all ideas for current user
 * @route   GET /api/ideas
 * @access  Private
 */
export const getIdeas = async (
  req: any,
  res: any,
  next: any
) => {
  try {
    const ideas = await Idea.find({ user: req.user.id }).sort('-createdAt');

    res.status(200).json({
      success: true,
      count: ideas.length,
      data: ideas,
    });
  } catch (error) {
    logger.error('Get ideas error:', error);
    next(error);
  }
};

/**
 * @desc    Get single idea
 * @route   GET /api/ideas/:id
 * @access  Private
 */
export const getIdea = async (
  req: any,
  res: any,
  next: any
) => {
  try {
    const idea = await Idea.findById(req.params.id);

    if (!idea) {
      return next(new AppError('Idea not found', 404));
    }

    // Check if the idea belongs to user or is public
    if (idea.user.toString() !== req.user.id && !idea.isPublic) {
      return next(new AppError('Not authorized to access this idea', 403));
    }

    res.status(200).json({
      success: true,
      data: idea,
    });
  } catch (error) {
    logger.error('Get idea error:', error);
    if (error instanceof mongoose.Error.CastError) {
      return next(new AppError('Idea not found', 404));
    }
    next(error);
  }
};

/**
 * @desc    Create a new idea
 * @route   POST /api/ideas
 * @access  Private
 */
export const createIdea = async (
  req: any,
  res: any,
  next: any
) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    // Validate required fields
    const { title, description, category, targetAudience } = req.body;
    
    if (!title || !description || !category || !targetAudience) {
      return next(new AppError('Please provide all required fields', 400));
    }

    // Create idea
    const idea = await Idea.create(req.body);

    res.status(201).json({
      success: true,
      data: idea,
    });
  } catch (error) {
    logger.error('Create idea error:', error);
    next(error);
  }
};

/**
 * @desc    Update idea
 * @route   PUT /api/ideas/:id
 * @access  Private
 */
export const updateIdea = async (
  req: any,
  res: any,
  next: any
) => {
  try {
    let idea = await Idea.findById(req.params.id);

    if (!idea) {
      return next(new AppError('Idea not found', 404));
    }

    // Check if idea belongs to user
    if (idea.user.toString() !== req.user.id) {
      return next(new AppError('Not authorized to update this idea', 403));
    }

    // Don't allow updating validation directly
    if (req.body.validation) {
      delete req.body.validation;
    }

    // Update idea
    idea = await Idea.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: idea,
    });
  } catch (error) {
    logger.error('Update idea error:', error);
    if (error instanceof mongoose.Error.CastError) {
      return next(new AppError('Idea not found', 404));
    }
    next(error);
  }
};

/**
 * @desc    Delete idea
 * @route   DELETE /api/ideas/:id
 * @access  Private
 */
export const deleteIdea = async (
  req: any,
  res: any,
  next: any
) => {
  try {
    const idea = await Idea.findById(req.params.id);

    if (!idea) {
      return next(new AppError('Idea not found', 404));
    }

    // Check if idea belongs to user
    if (idea.user.toString() !== req.user.id) {
      return next(new AppError('Not authorized to delete this idea', 403));
    }

    await idea.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    logger.error('Delete idea error:', error);
    if (error instanceof mongoose.Error.CastError) {
      return next(new AppError('Idea not found', 404));
    }
    next(error);
  }
};

/**
 * @desc    Validate idea with AI
 * @route   POST /api/ideas/:id/validate
 * @access  Private
 */
export const validateIdea = async (
  req: any,
  res: any,
  next: any
) => {
  try {
    const idea = await Idea.findById(req.params.id);

    if (!idea) {
      return next(new AppError('Idea not found', 404));
    }

    // Check if idea belongs to user
    if (idea.user.toString() !== req.user.id) {
      return next(new AppError('Not authorized to validate this idea', 403));
    }

    // Check if idea has required fields for validation
    if (!idea.title || !idea.description || !idea.category || !idea.targetAudience) {
      return next(new AppError('Idea missing required fields for validation', 400));
    }

    // Update idea status
    idea.status = 'pending';
    await idea.save();

    // Get additional context from request if provided
    const additionalContext = req.body.additionalContext || '';

    // Call AI service to validate idea
    const validation = await AIService.validateIdea({
      idea: {
        title: idea.title,
        description: idea.description,
        category: idea.category,
        targetAudience: idea.targetAudience,
      },
      additionalContext,
    });

    // Update idea with validation results
    idea.validation = validation;
    idea.status = 'validated';
    await idea.save();

    res.status(200).json({
      success: true,
      data: idea,
    });
  } catch (error) {
    logger.error('Validate idea error:', error);
    
    // If we already created the idea but validation failed, update status
    if (req.params.id) {
      try {
        const idea = await Idea.findById(req.params.id);
        if (idea && idea.status === 'pending') {
          idea.status = 'draft';
          await idea.save();
        }
      } catch (updateError) {
        logger.error('Error updating idea status after validation fail:', updateError);
      }
    }
    next(error);
  }
};

/**
 * @desc    Get public ideas
 * @route   GET /api/ideas/public
 * @access  Public
 */
export const getPublicIdeas = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get validated and public ideas, sorted by validation score
    const ideas = await Idea.find({ 
      isPublic: true, 
      status: 'validated',
      'validation.overallScore': { $gt: 0 }
    })
    .sort({ 'validation.overallScore': -1 })
    .populate('user', 'name')
    .limit(10);

    res.status(200).json({
      success: true,
      count: ideas.length,
      data: ideas,
    });
  } catch (error) {
    logger.error('Get public ideas error:', error);
    next(error);
  }
};

/**
 * @desc    Email a validation report to the user
 * @route   POST /api/ideas/:id/email-report
 * @access  Private
 */
export const emailValidationReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const ideaId = req.params.id;
    
    // Find the idea
    const idea = await Idea.findById(ideaId);
    
    if (!idea) {
      return next(new AppError('Idea not found', 404));
    }
    
    // Check if user owns this idea
    if (idea.user.toString() !== req.user.id) {
      return next(new AppError('Not authorized to access this idea', 401));
    }
    
    // Get the user's email
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return next(new AppError('User not found', 404));
    }
    
    // Generate report URL
    const reportUrl = `${req.protocol}://${req.get('host')}/dashboard/ideas/${ideaId}`;
    
    // Send email with validation report
    await emailService.sendValidationReportEmail(
      user.email,
      idea.title,
      idea.validationScore,
      reportUrl
    );
    
    res.status(200).json({
      success: true,
      message: 'Validation report email sent successfully',
    });
  } catch (error) {
    logger.error('Error sending validation report email:', error);
    next(error);
  }
}; 
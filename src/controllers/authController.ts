import { Request, Response } from 'express';
import User from '../models/user';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import { emailService } from '../utils/emailService';
import crypto from 'crypto';

// Custom Request type with body
interface ExtendedRequest extends Request {
  body: any;
  user?: any;
  protocol?: string;
  get?: (name: string) => string;
}

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (
  req: ExtendedRequest,
  res: Response,
  next: any
) => {
  try {
    const { name, email, password } = req.body;

    console.log('Registration attempt:', { name, email });

    // Dev mode: Skip database check and always return a successful response
    if (process.env.NODE_ENV === 'development') {
      // Mock user
      const mockUser = {
        _id: '12345',
        name,
        email,
        role: 'user',
        getSignedJwtToken: () => 'mock_jwt_token_for_development'
      };

      console.log('Created mock user:', mockUser);
      return sendTokenResponse(mockUser, 201, res);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return next(new AppError('Email already in use', 400));
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
    });

    // Send welcome email
    try {
      await emailService.sendWelcomeEmail(name, email);
    } catch (error) {
      // Log error but don't fail registration if email fails
      logger.error('Failed to send welcome email:', error);
    }

    // Send token response
    sendTokenResponse(user, 201, res);
  } catch (error) {
    logger.error('Registration error:', error);
    next(error);
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (
  req: ExtendedRequest,
  res: Response,
  next: any
) => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt:', { email });

    // Validate email & password
    if (!email || !password) {
      return next(new AppError('Please provide both email and password', 400));
    }

    // Dev mode: Skip database check and always return a successful response
    if (process.env.NODE_ENV === 'development') {
      // Mock user
      const mockUser = {
        _id: '12345',
        name: 'Test User',
        email,
        role: 'user',
        getSignedJwtToken: () => 'mock_jwt_token_for_development'
      };

      console.log('Logged in mock user:', mockUser);
      return sendTokenResponse(mockUser, 200, res);
    }

    // Check for user with password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return next(new AppError('Invalid credentials', 401));
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return next(new AppError('Invalid credentials', 401));
    }

    // Send JWT token
    sendTokenResponse(user, 200, res);
  } catch (error) {
    logger.error('Login error:', error);
    next(error);
  }
};

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (
  req: ExtendedRequest,
  res: Response,
  next: any
) => {
  try {
    // Get user from req (set by auth middleware)
    const user = await User.findById(req.user?.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    logger.error('Get user error:', error);
    next(error);
  }
};

/**
 * @desc    Logout user / clear cookie
 * @route   GET /api/auth/logout
 * @access  Private
 */
export const logout = (_req: ExtendedRequest, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Successfully logged out',
  });
};

/**
 * @desc    Forgot password
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = async (
  req: ExtendedRequest,
  res: Response,
  next: any
) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return next(new AppError('No user found with that email', 404));
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Hash token and set to resetPasswordToken field
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    
    // Set expire time (1 hour)
    const resetPasswordExpire = new Date(Date.now() + 3600000);
    
    // Update user with reset token info
    await User.findByIdAndUpdate(user.id, {
      resetPasswordToken,
      resetPasswordExpire,
    });

    // Create reset URL
    const resetUrl = `${req.protocol}://${req.get && req.get('host')}/reset-password`;
    
    try {
      // Send email with reset token
      await emailService.sendPasswordResetEmail(email, resetToken, resetUrl);
      
      res.status(200).json({
        success: true,
        message: 'Password reset email sent',
      });
    } catch (error) {
      // If email fails, remove reset token from user
      await User.findByIdAndUpdate(user.id, {
        resetPasswordToken: undefined,
        resetPasswordExpire: undefined,
      });
      
      logger.error('Error sending password reset email:', error);
      return next(new AppError('Email could not be sent', 500));
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Helper function to get token from model, create cookie and send response
 */
const sendTokenResponse = (user: any, statusCode: number, res: Response) => {
  // Create token
  const token = user.getSignedJwtToken();

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    success: true,
    token,
    user,
  });
}; 
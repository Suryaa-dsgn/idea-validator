import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler';
import User from '../models/user';

// Define a custom interface extending Express Request
interface RequestWithUser extends Request {
  user: any;
}

// Middleware to protect routes that require authentication
export const protect = async (
  req: any,
  res: any,
  next: any
) => {
  try {
    let token;

    // Get token from Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return next(
        new AppError('Not authorized to access this route', 401)
      );
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'default_secret'
    ) as any;

    // Find user by id from decoded token
    const user = await User.findById(decoded.id);

    // Check if user still exists
    if (!user) {
      return next(
        new AppError('The user belonging to this token no longer exists', 401)
      );
    }

    // Grant access to protected route
    req.user = user;
    next();
  } catch (error) {
    return next(
      new AppError('Not authorized to access this route', 401)
    );
  }
};

// Middleware to restrict routes to certain user roles
export const restrictTo = (...roles: string[]) => {
  return (req: any, res: any, next: any) => {
    // Check if user has the required role
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          'You do not have permission to perform this action',
          403
        )
      );
    }
    next();
  };
}; 
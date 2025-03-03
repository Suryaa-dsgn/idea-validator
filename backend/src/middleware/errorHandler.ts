import { Request, Response } from 'express';
import { logger } from '../utils/logger';

// Custom error class for API errors
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Types for MongoDB errors
interface MongoError extends Error {
  code?: number;
}

// Error handler middleware
export const errorHandler = (
  err: Error | AppError | MongoError,
  req: Request,
  res: any,
  next: any
) => {
  // Log the error
  logger.error(`${err.name}: ${err.message}`, { stack: err.stack });

  // Default error values
  let statusCode = 500;
  let message = 'Something went wrong';
  let isOperational = false;

  // Check if it's our custom error
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    isOperational = err.isOperational;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
    isOperational = true;
  }

  // Mongoose duplicate key error
  if (err.name === 'MongoError' && (err as MongoError).code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value entered';
    isOperational = true;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token. Please log in again.';
    isOperational = true;
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Your token has expired. Please log in again.';
    isOperational = true;
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    isOperational,
  });
}; 
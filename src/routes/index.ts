import { Router } from 'express';
import { Request, Response } from 'express-serve-static-core';
import authRoutes from './authRoutes';
import ideaRoutes from './ideaRoutes';

/**
 * Setup all API routes
 */
export const setupRoutes = (app: any) => {
  // API route prefix
  const API_PREFIX = '/api';

  // Auth Routes
  app.use(`${API_PREFIX}/auth`, authRoutes);

  // Idea Routes
  app.use(`${API_PREFIX}/ideas`, ideaRoutes);

  // Health check route
  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: 'API is running',
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    });
  });

  // 404 route for API
  app.use(`${API_PREFIX}/*`, (_req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      message: 'API route not found',
    });
  });
}; 
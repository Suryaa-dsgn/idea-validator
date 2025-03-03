declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    PORT: string;
    MONGODB_URI: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    OPENAI_API_KEY: string;
    OPENAI_MODEL: string;
    STRIPE_SECRET_KEY: string;
    STRIPE_WEBHOOK_SECRET: string;
    SENDGRID_API_KEY: string;
    SENDGRID_FROM_EMAIL: string;
    RATE_LIMIT_WINDOW_MS: string;
    RATE_LIMIT_MAX_REQUESTS: string;
    LOG_LEVEL: string;
  }
}

// Declare modules without available type definitions or with issues
declare module 'express-rate-limit';
declare module 'express';
declare module 'cors';
declare module 'helmet';
declare module 'morgan';
declare module 'dotenv';
declare module 'mongoose';
declare module 'jsonwebtoken';
declare module 'bcryptjs';
declare module 'stripe';
declare module 'winston' {
  interface Logform {
    TransformableInfo: {
      timestamp?: string;
      level: string;
      message: string;
      [key: string]: any;
    };
  }
}

// Extend Error constructor
interface ErrorConstructor {
  captureStackTrace(targetObject: object, constructorOpt?: Function): void;
} 
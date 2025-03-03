import { IUser } from '../models/user';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user: any;
    }
  }
} 
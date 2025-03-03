import express from 'express';
import { register, login, getMe, logout, forgotPassword } from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.get('/logout', logout);

// Protected routes
router.get('/me', protect, getMe);

export default router;
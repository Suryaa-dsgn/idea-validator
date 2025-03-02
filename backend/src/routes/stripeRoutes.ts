import express from 'express';
import { protect } from '../middleware/auth';
import { createCheckoutSession, handleWebhook } from '../controllers/stripeController';

const router = express.Router();

// Stripe webhook - must be public and raw body
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// Protected payment routes
router.post('/checkout-session', protect, createCheckoutSession);

export default router; 
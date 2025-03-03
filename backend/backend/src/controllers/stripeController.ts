import { Request, Response, NextFunction } from 'express';
import Stripe from 'stripe';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import User from '../models/user';

// Initialize Stripe with API key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

/**
 * @desc    Create checkout session for subscription
 * @route   POST /api/payments/checkout-session
 * @access  Private
 */
export const createCheckoutSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { priceId, planName } = req.body;

    if (!priceId) {
      return next(new AppError('Please provide a price ID', 400));
    }

    // Get user from database
    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: user.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId: user.id,
        planName: planName || 'Premium Plan',
      },
      success_url: `${req.headers.origin}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/subscription/cancel`,
    });

    res.status(200).json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    logger.error('Stripe checkout error:', error);
    next(error);
  }
};

/**
 * @desc    Handle webhook events from Stripe
 * @route   POST /api/payments/webhook
 * @access  Public
 */
export const handleWebhook = async (req: Request, res: Response) => {
  const signature = req.headers['stripe-signature'] as string;

  try {
    // Verify webhook signature
    const event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );

    // Handle specific events
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Get customer details
        const userId = session.metadata?.userId;
        
        if (userId) {
          // Update user subscription status
          await User.findByIdAndUpdate(userId, {
            subscriptionStatus: 'active',
            subscriptionId: session.subscription,
          });
          
          logger.info(`Subscription activated for user: ${userId}`);
        }
        break;
      }
      
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Find user with this subscription ID
        const user = await User.findOne({ subscriptionId: subscription.id });
        
        if (user) {
          // Update subscription status
          user.subscriptionStatus = subscription.status;
          await user.save();
          
          logger.info(`Subscription updated for user: ${user.id}`);
        }
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Find user with this subscription ID
        const user = await User.findOne({ subscriptionId: subscription.id });
        
        if (user) {
          // Cancel subscription
          user.subscriptionStatus = 'canceled';
          await user.save();
          
          logger.info(`Subscription canceled for user: ${user.id}`);
        }
        break;
      }
    }

    res.status(200).json({ received: true });
  } catch (error) {
    logger.error('Stripe webhook error:', error);
    res.status(400).json({ received: false, error: (error as Error).message });
  }
}; 
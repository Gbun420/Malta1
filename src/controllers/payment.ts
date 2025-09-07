import { Request, Response } from 'express';
import Stripe from 'stripe';
import * as transactionRepository from '../repositories/transaction.repository';
import * as listingRepository from '../repositories/listing.repository';
import * as analytics from '../services/analytics.service';
import { problemDetails } from '../utils/problemDetails';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

export const createPaymentIntent = async (req: Request, res: Response) => {
  const idempotencyKey = req.headers['idempotency-key'] as string;
  if (!idempotencyKey) {
    return res.status(400).type('application/problem+json').json(problemDetails(
      400,
      'https://http.dev/problems/bad-request',
      'Bad Request',
      'Idempotency-Key header is required',
      req.originalUrl
    ));
  }

  if (process.env.PURCHASE_ENABLED !== 'true') {
    return res.status(503).type('application/problem+json').json(problemDetails(
      503,
      'https://http.dev/problems/service-unavailable',
      'Service Unavailable',
      'Purchase feature is currently disabled',
      req.originalUrl
    ));
  }

  try {
    const { listingId, amount } = req.body;
    const listing = await listingRepository.findListingById(listingId);

    if (!listing) {
      return res.status(404).type('application/problem+json').json(problemDetails(
        404,
        'https://http.dev/problems/not-found',
        'Not Found',
        'Listing not found',
        req.originalUrl
      ));
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'eur',
      payment_method_types: ['card'],
      metadata: { listing_id: listingId, seller_id: listing.seller_id },
    }, { idempotencyKey });

    // Emit analytics event
    analytics.trackEvent('create_purchase_intent', { listing_id: listingId, amount });

    res.status(201).json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    res.status(500).type('application/problem+json').json(problemDetails(
      500,
      'https://http.dev/problems/internal-server-error',
      'Internal Server Error',
      error.message || 'An unexpected error occurred',
      req.originalUrl
    ));
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntentSucceeded = event.data.object as Stripe.PaymentIntent;
      console.log(`PaymentIntent for ${paymentIntentSucceeded.amount} was successful!`);
      // Update transaction status in your DB
      await transactionRepository.createTransaction({
        listing_id: parseInt(paymentIntentSucceeded.metadata?.listing_id as string),
        buyer_id: 0, // TODO: Get buyer ID from somewhere
        seller_id: parseInt(paymentIntentSucceeded.metadata?.seller_id as string),
        amount: paymentIntentSucceeded.amount,
        status: 'COMPLETED',
      });
      analytics.trackEvent('purchase', { transaction_id: paymentIntentSucceeded.id, amount: paymentIntentSucceeded.amount, listing_id: paymentIntentSucceeded.metadata?.listing_id });
      break;
    case 'payment_intent.payment_failed':
      const paymentIntentFailed = event.data.object as Stripe.PaymentIntent;
      console.log(`PaymentIntent for ${paymentIntentFailed.amount} failed!`);
      // Update transaction status in your DB
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};
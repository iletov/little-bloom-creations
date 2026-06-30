import Stripe from 'stripe';

const apiKey = process.env.STRIPE_SECRET_KEY as string;

if (!apiKey) {
  throw new Error('Missing Stripe secret key');
}

const stripe = new Stripe(apiKey!, {
  apiVersion: '2025-01-27.acacia',
});

export default stripe;

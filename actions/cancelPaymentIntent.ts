'use server';

// import stripe from '@/lib/stripe';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

type CancelPaymentIntentProps = {
  paymentIntentId: string;
};

export const cancelPaymentIntent = async ({
  paymentIntentId,
}: CancelPaymentIntentProps) => {
  try {
    await stripe.paymentIntents.cancel(paymentIntentId);
    console.log('Payment Intent Canceled---->', paymentIntentId);
  } catch (error) {
    console.error('Error canceling payment intent', error);
    throw error;
  }
};

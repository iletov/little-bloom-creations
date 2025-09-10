import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export const POST = async (req: NextRequest) => {
  try {
    const allPaymentIntents = await stripe.paymentIntents.list({
      limit: 20,
    });

    const incompletePayments = allPaymentIntents.data.filter(
      (paymentIntent: Stripe.PaymentIntent) =>
        paymentIntent.status === 'requires_payment_method',
    );

    const incompletePaymentsFormated = incompletePayments.map(
      (paymentIntent: Stripe.PaymentIntent) => {
        return {
          id: paymentIntent.id,
          status: paymentIntent.status,
          created: paymentIntent.created,
        };
      },
    );

    // const cancelPaymentIntents = async () => {
    //   for (const paymentIntent of incompletePaymentsFormated) {
    //     if (paymentIntent.created < Date.now() - 1000 * 60 * 60)
    //       try {
    //         await stripe.paymentIntents.cancel(paymentIntent.id);
    //         console.log('Payment Intent Canceled', paymentIntent.id);
    //       } catch (error) {
    //         console.error(
    //           `Error canceling payment intent ${paymentIntent.id}`,
    //           error,
    //         );
    //       }
    //   }
    // };

    // cancelPaymentIntents();

    return NextResponse.json({
      data: allPaymentIntents,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: `Payment Intent Error for Cancelation: ${error}` },
      { status: 500 },
    );
  }
};

export const GET = async (req: NextRequest) => {
  try {
    const allPaymentIntents = await stripe.paymentIntents.list({
      limit: 100,
      status: 'requires_payment_method', // The status of incomplete payment intents
    });

    console.log(' GET/api/cancel-payment ---->', allPaymentIntents);

    return NextResponse.json({
      data: allPaymentIntents,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: `Payment Intent Error for Cancelation: ${error}` },
      { status: 500 },
    );
  }
};

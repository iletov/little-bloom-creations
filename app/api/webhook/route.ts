import stripe from '@/lib/stripe';
import { backendClient } from '@/sanity/lib/backendClient';
import { NextResponse, NextRequest } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { GroupedCartItem, Metadata } from '../payment-intent/route';

interface Order {
  _id: string;
  quantity: number;
  newStock: number;
  product: {
    _id: string;
    stock: number;
  };
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  // console.log('webhook', body);

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing Stripe signature' },
      { status: 400 },
    );
  }

  const webhoohSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  if (!webhoohSecret) {
    return NextResponse.json(
      { error: 'Missing Stripe webhook secret' },
      { status: 400 },
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhoohSecret);
  } catch (error) {
    console.log('Error verifying Stripe signature', error);

    return NextResponse.json(
      { error: 'Invalid Stripe signature' },
      { status: 400 },
    );
  }

  if (event.type === 'payment_intent.succeeded') {
    const session = event.data.object as Stripe.PaymentIntent;

    try {
      console.log('-----Order updated successfully in sanity!------');
    } catch (error) {
      console.log('Error creating order in sanity', error);
      return NextResponse.json(
        { error: 'Error creating order in sanity' },
        { status: 500 },
      );
    }
  }

  // if (event.type === 'payment_intent.payment_failed') {
  //   const session = event.data.object as Stripe.PaymentIntent;

  //   try {
  //     const findOrderById = await backendClient.fetch(
  //       `*[_type == 'order' && stripePaymentIntentId == $paymentIntentId][0]`,
  //       { paymentIntentId: session.id },
  //     );

  //     if (!findOrderById) {
  //       return NextResponse.json({ error: 'Order not found' }, { status: 400 });
  //     }

  //     const updateOrder = await backendClient
  //       .patch(findOrderById._id)
  //       .set({
  //         status: 'failed',
  //         stripeCustomerId: session.customer as string,
  //       })
  //       .commit();

  //     console.log(
  //       'Order updated successfully to status FAILED in sanity',
  //       updateOrder,
  //     );
  //   } catch (error) {
  //     console.log('Error marked as failed', error);
  //     return NextResponse.json(
  //       { error: 'Error updating order in sanity' },
  //       { status: 500 },
  //     );
  //   }
  // }

  // if (event.type === 'payment_intent.canceled') {
  //   const session = event.data.object as Stripe.PaymentIntent;

  //   try {
  //     const findOrderById = await backendClient.fetch(
  //       `*[_type == 'order' && stripePaymentIntentId == $paymentIntentId][0]`,
  //       { paymentIntentId: session.id },
  //     );

  //     if (!findOrderById) {
  //       return NextResponse.json({ error: 'Order not found' }, { status: 400 });
  //     }

  //     const updateOrder = await backendClient
  //       .patch(findOrderById._id)
  //       .set({
  //         status: 'canceled',
  //         stripeCustomerId: session.customer as string,
  //       })
  //       .commit();

  //     console.log(
  //       'Order updated successfully to status CANCELED in sanity',
  //       updateOrder,
  //     );
  //   } catch (error) {
  //     console.log('Error marked as canceled', error);
  //     return NextResponse.json(
  //       { error: 'Error updating order in sanity' },
  //       { status: 500 },
  //     );
  //   }
  // }

  return NextResponse.json({ received: true });
}

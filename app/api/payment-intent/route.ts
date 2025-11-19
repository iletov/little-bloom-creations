import { CartItem } from '@/app/store/features/cart/cartSlice';
import { userCheckout } from '@/lib/db/userCheckout';
import { backendClient } from '@/sanity/lib/backendClient';
import { NextRequest, NextResponse } from 'next/server';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export type Metadata = {
  orderNumber: string;
  customerName: string;
  customerEmail: string | undefined;
  supabaseUserId: string | null;
};

export type GroupedCartItem = {
  product: CartItem['product'];
  quantity: number;
};

export const POST = async (req: NextRequest) => {
  const { metadata, amount, existingPaymentIntentId } = await req.json();

  console.log('SERVER - EXISTING PID----->', existingPaymentIntentId);
  console.log('====================');
  console.log('New TOTAL Amount', amount);
  console.log('====================');

  try {
    //validation

    // const itemsWithoutPrice = cartItems.filter(
    //   (item: GroupedCartItem) => !item.product.price,
    // );

    // if (itemsWithoutPrice.length > 0) {
    //   return NextResponse.json(
    //     { error: "Some items don't have price" },
    //     { status: 400 },
    //   );
    // }

    // get/create customer

    const customers = await stripe.customers.list({
      email: metadata.customerEmail,
      limit: 1,
    });

    let customerId: string | undefined;

    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    //Check for existing payment intent and if neccessary update it

    if (existingPaymentIntentId) {
      try {
        const existingPaymentIntent = await stripe.paymentIntents.retrieve(
          existingPaymentIntentId,
        );

        if (
          existingPaymentIntent &&
          existingPaymentIntent.status === 'requires_payment_method'
        ) {
          const updatedPaymentIntent = await stripe.paymentIntents.update(
            existingPaymentIntentId,
            {
              amount: amount,
              metadata: metadata,
              receipt_email: metadata.customerEmail,
            },
          );

          return NextResponse.json({
            clientSecret: updatedPaymentIntent.client_secret,
            paymentIntentId: updatedPaymentIntent.id,
          });
        }
      } catch (error) {
        console.error('Error retrieving/updating payment intent:', error);
      }
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'bgn',
      automatic_payment_methods: { enabled: true },
      customer: customerId,
      // customer_creation: customerId ? undefined : 'always',
      // customer_email: !customerId ? metadata.customerEmail : undefined,
      metadata: metadata,
      // items: JSON.stringify(lineItems),
      receipt_email: metadata.customerEmail,
      description: `${metadata.orderNumber} for ${metadata.customerName}`,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 },
    );
  }
};

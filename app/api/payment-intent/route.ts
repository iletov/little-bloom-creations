import { CartItem } from '@/app/store/features/cart/cartSlice';
import { convertToSubCurrency } from '@/lib/convertAmount';
import { userCheckout } from '@/lib/db/userCheckout';
import { createClient } from '@/lib/supabaseServer';
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
  const supabase = await createClient();
  const {
    cartItems,
    metadata,
    amount,
    existingPaymentIntentId,
    orderDetails,
    orderMethods,
  } = await req.json();

  console.log('SERVER - EXISTING PID----->', existingPaymentIntentId);
  console.log('====================');
  console.log('New TOTAL Amount', amount);
  console.log('====================');

  if (!cartItems || !metadata || !amount || !orderDetails || !orderMethods) {
    return NextResponse.json(
      { error: 'Missing required data! Cannot create payment intent' },
      { status: 400 },
    );
  }

  // console.log(
  //   'ITEMS SENT TO PURCHASE ORDER:',
  //   JSON.stringify(cartItems, null, 2),
  // );

  try {
    // create stripe customer

    const customers = await stripe.customers.list({
      email: metadata.customerEmail,
      limit: 1,
    });

    let customerId: string | undefined;

    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    //STEP 1 - Check for existing payment intent and if neccessary update it

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

          console.log('PaymentIntent UPDATED:', updatedPaymentIntent.id);

          return NextResponse.json({
            clientSecret: updatedPaymentIntent.client_secret,
            paymentIntentId: updatedPaymentIntent.id,
          });
        }
      } catch (error) {
        console.error('Error retrieving/updating payment intent:', error);
      }
    }

    // STEP 2 - create payment intent

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'eur',
      automatic_payment_methods: { enabled: true },
      customer: customerId,
      // customer_creation: customerId ? undefined : 'always',
      // customer_email: !customerId ? metadata.customerEmail : undefined,
      metadata: metadata,
      // items: JSON.stringify(lineItems),
      receipt_email: metadata.customerEmail,
      description: `Order for ${metadata.customerName} - ${amount} EUR`,
    });

    // console.log('PaymentIntent created:', paymentIntent.id);

    // StEP 3 - store order data in pending_orders table in supabase

    const neccessaryItems = cartItems.map((item: any) => ({
      sku: item?.product.sku,
      quantity: item?.quantity,
      personalization: item?.personalisation,
      variant_sku: item?.product?.variant?.sku ?? null,
      variant_name: item?.product?.variant?.name ?? null,
    }));

    const { data: pendingOrder, error: dbError } = await supabase
      .from('pending_orders')
      .insert({
        stripe_payment_intent_id: paymentIntent.id,
        order_number: metadata.orderNumber,
        cart_items: neccessaryItems,
        order_details: orderDetails,
        metadata,
        order_methods: orderMethods,
      })
      .select()
      .single();

    if (dbError) {
      console.log('Failed to store pending order:', dbError);
      return NextResponse.json(
        { error: 'Failed to store pending order' },
        { status: 500 },
      );
    }

    // webhook event tracking order

    await supabase.from('webhook_events').insert({
      stripe_payment_intent: paymentIntent.id,
      order_number: metadata.orderNumber,
      event_type: 'payment_initiated',
      status: 'pending',
    });

    console.log('Pending order stored:', pendingOrder.id);

    //  END - return client secret

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

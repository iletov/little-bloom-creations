import stripe from '@/lib/stripe';
import { NextResponse, NextRequest } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabaseServer';

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
  const supabase = await createClient();

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

  //SUCCESS

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    console.log(
      '---Payment succeeded:-->',
      paymentIntent.id,
      paymentIntent.metadata.orderNumber,
    );

    try {
      // check if order allready exists
      const { data: existingOrder } = await supabase
        .from('orders')
        .select('id')
        // .eq('stripe_payment_intent', paymentIntent.id)
        .eq('order_number', paymentIntent.metadata.orderNumber)
        .single();

      if (existingOrder) {
        console.log(
          '---Order already exists--!!!',
          paymentIntent.metadata.orderNumber,
        );

        //update webhook status
        await supabase
          .from('webhook_events')
          .update({ status: 'success', order_id: existingOrder?.id })
          .eq('order_number', paymentIntent.metadata.orderNumber);

        return NextResponse.json({
          received: true,
          message: 'Order already exists',
        });
      }

      // fetch data from pending_orders

      const { data: pendingOrder, error: fetchError } = await supabase
        .from('pending_orders')
        .select('*')
        .eq('order_number', paymentIntent.metadata.orderNumber)
        .single();

      if (fetchError || !pendingOrder) {
        console.error('Pending order not found:', paymentIntent.id);

        // update webhook event with error

        await supabase
          .from('webhook_events')
          .update({
            status: 'failed',
            error_message: 'Pending order not found',
          })
          .eq('order_number', paymentIntent.metadata.orderNumber);

        throw new Error('Pending order data not found');
      }

      console.log('Pending order found, creating actual order...');

      // shipping details

      const dbItems = pendingOrder.cart_items.map((item: any) => ({
        sku: item?.sku,
        quantity: item?.quantity,
        personalization: item?.personalization,
        variant_sku: item?.variant_sku ?? null,
        variant_name: item?.variant_name ?? null,
      }));

      const shippingDetails = {
        email: pendingOrder?.metadata?.customerEmail,
        full_name: pendingOrder?.metadata?.customerName,
        order_number: pendingOrder?.metadata?.orderNumber,

        //from orderDetails
        phone: pendingOrder?.order_details?.phoneNumber,
        country: pendingOrder?.order_details?.country,
        city: pendingOrder?.order_details?.city,
        postal_code: pendingOrder?.order_details?.postalCode,
        street: pendingOrder?.order_details?.street ?? null,
        street_number: pendingOrder?.order_details?.streetNumber ?? null,
        additional_info: pendingOrder?.order_details?.other ?? null,
        office_code: pendingOrder?.order_details?.officeCode ?? null,
      };

      const orderMethods = {
        delivery_method: pendingOrder?.order_methods?.deliveryMethod,
        payment_method: pendingOrder?.order_methods?.paymentMethod,
        delivery_cost: pendingOrder?.order_methods?.deliveryCost,
      };

      // call purchase_order rpc from supabase

      const { data: orderData, error: rpcError } = await supabase.rpc(
        'purchase_order',
        {
          p_user_id: pendingOrder?.metadata?.supabaseUserId ?? null,
          p_items: dbItems,
          p_shipping: shippingDetails,
          p_order_methods: orderMethods,
          p_stripe_payment_intent: paymentIntent.id,
        },
      );

      // Refund payment if order failed

      if (!orderData?.success) {
        console.error('Failed to create order:', rpcError || orderData?.error);

        const errorMessage =
          orderData?.error || rpcError?.message || 'Order creation failed';

        await supabase
          .from('webhook_events')
          .update({ status: 'failed', error_message: errorMessage })
          .eq('order_number', paymentIntent.metadata.orderNumber);

        const refund = await stripe.refunds.create({
          payment_intent: paymentIntent.id,
          reason: 'requested_by_customer',
          metadata: {
            reason: errorMessage,
          },
        });

        console.log('Payment refunded:', refund.id, 'Reason:', errorMessage);

        await supabase
          .from('pending_orders')
          .update({
            status: 'refunded',
            error_message: `Refunded: ${errorMessage}`,
          })
          .eq('order_number', paymentIntent.metadata.orderNumber);

        throw new Error(errorMessage);
      }

      if (rpcError) {
        console.error('RPC execution error:', rpcError);

        // update webhook event with error
        await supabase
          .from('webhook_events')
          .update({
            status: 'failed',
            error_message: rpcError.message,
          })
          .eq('order_number', paymentIntent.metadata.orderNumber);

        // refund

        await stripe.refunds.create({
          payment_intent: paymentIntent.id,
          reason: 'requested_by_customer',
          metadata: {
            reason: rpcError.message,
          },
        });

        throw new Error(rpcError.message);
      }

      console.log('Order created successfully:', orderData.order_id);

      // update order status to paid

      const { error: statusError } = await supabase.rpc('update_order_status', {
        p_order_id: orderData.order_id,
        p_new_status: 'confirmed',
      });

      if (statusError) {
        console.error('Failed to update order status:', statusError);
      }

      // update webhook event with success
      await supabase
        .from('webhook_events')
        .update({
          status: 'success',
          order_id: orderData.order_id,
        })
        .eq('order_number', paymentIntent.metadata.orderNumber);

      // delete pending order

      await supabase.from('pending_orders').delete().eq('id', pendingOrder.id);

      console.log('Order processing complete:', {
        order_id: orderData.order_id,
        payment_intent: paymentIntent.id,
        order_number: paymentIntent.metadata.orderNumber,
        amount: (paymentIntent.amount / 100).toFixed(2),
      });

      //TODO: send order confirmation email
      // for example - await sendOrderConfirmationEmail(orderData.order_id, shippingDetails.email);
    } catch (error) {
      console.error('Error processing payment_intent.succeeded:', error);
      return NextResponse.json(
        { error: 'Error processing payment_intent.succeeded:' },
        { status: 500 },
      );
    }
  }

  //FAILED

  if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    console.log('Payment failed:', paymentIntent.metadata.orderNumber);

    // upodate webhook event

    await supabase
      .from('webhook_events')
      .update({
        status: 'failed',
        error_message: paymentIntent.last_payment_error?.message,
      })
      .eq('order_number', paymentIntent.metadata.orderNumber);

    //clean pending_order

    await supabase
      .from('pending_orders')
      .delete()
      .eq('order_number', paymentIntent.metadata.orderNumber);

    console.log(
      'Pending order cleaned up:',
      paymentIntent.metadata.orderNumber,
    );
  }

  if (event.type === 'charge.refunded') {
    const charge = event.data.object as Stripe.Charge;
    console.log('Charge refunded:', charge.payment_intent);

    // Update webhook event
    await supabase
      .from('webhook_events')
      .update({ status: 'refunded' })
      .eq('stripe_payment_intent', charge.payment_intent);

    const { data: order } = await supabase
      .from('orders')
      .select('id')
      .eq('stripe_payment_intent', charge.payment_intent)
      .single();

    if (order) {
      await supabase.rpc('cancel_order', {
        p_order_id: order.id,
        p_user_id: null,
      });

      await supabase.rpc('update_order_status', {
        p_order_id: order.id,
        p_new_status: 'refunded',
      });
    }
  }

  if (event.type === 'payment_intent.canceled') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    console.log('Payment canceled:', paymentIntent.id);
  }

  return NextResponse.json({ received: true });
}

// app/api/webhook-status/route.ts
import { createClient } from '@/lib/supabaseServer';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = await createClient();

  try {
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get('order_number');

    if (!orderNumber) {
      return NextResponse.json(
        { error: 'Missing order_number parameter' },
        { status: 400 },
      );
    }

    // Fetch webhook event status
    const { data: webhookEvent, error } = await supabase
      .from('webhook_events')
      .select('*')
      .eq('order_number', orderNumber)
      .single();
    // .limit(1)
    // .maybeSingle();

    if (error) {
      console.error('Error fetching webhook event:', error);
      return NextResponse.json(
        { error: 'Webhook event not found' },
        { status: 404 },
      );
    }

    // If successful fetch order details
    if (webhookEvent.status === 'success' && webhookEvent.order_id) {
      const { data: order } = await supabase
        .from('orders')
        .select('id, total_amount, created_at, order_number')
        .eq('id', webhookEvent.order_id)
        .single();

      return NextResponse.json({
        status: 'success',
        order: order,
        order_number: webhookEvent?.order_number,
        message: 'Order created successfully!',
      });
    }

    // If failed return error message
    if (webhookEvent.status === 'failed') {
      return NextResponse.json({
        status: 'failed',
        order_number: webhookEvent?.order_number,
        error: webhookEvent.error_message,
        message: `Order creation failed: ${webhookEvent.error_message}`,
      });
    }

    // If refunded
    if (webhookEvent.status === 'refunded') {
      return NextResponse.json({
        status: 'refunded',
        order_number: webhookEvent?.order_number,
        error: webhookEvent.error_message,
        message: `Payment refunded: ${webhookEvent.error_message}`,
      });
    }

    // Still pending (webhook hasnt processed yet)
    return NextResponse.json({
      status: 'pending',
      order_number: webhookEvent?.order_number,
      message: 'Processing your order. Please wait...',
    });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

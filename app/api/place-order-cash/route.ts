import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';

export const POST = async (req: NextRequest) => {
  const supabase = await createClient();
  const body = await req.json();

  // console.log(
  //   'ITEMS SENT TO PURCHASE ORDER:',
  //   JSON.stringify(body.orderMethods, null, 2),
  // );

  try {
    const requiredFields = {
      metadata: ['customerName', 'customerEmail'],
      orderDetails: ['country', 'city', 'postalCode', 'phoneNumber'],
    };

    for (const [key, value] of Object.entries(requiredFields)) {
      if (body[key]) {
        for (const field of value) {
          if (!body[key][field] || !body[key]) {
            return NextResponse.json(
              { error: `Missing ${field} in ${key}` },
              { status: 400 },
            );
          }
        }
      }
    }

    const dbItems = body.cartItems.map((item: any) => ({
      sku: item?.product.sku,
      quantity: item?.quantity,
      personalization: item?.personalization,
      variant_sku: item?.product?.variant?.sku ?? null,
      variant_name: item?.product?.variant?.name ?? null,
    }));

    const shippingDetails = {
      email: body.metadata?.customerEmail,
      full_name: body.metadata?.customerName,

      //from orderDetails
      phone: body.orderDetails?.phoneNumber,
      country: body.orderDetails?.country,
      city: body.orderDetails?.city,
      postal_code: body.orderDetails?.postalCode,
      street: body.orderDetails?.street ?? null,
      street_number: body.orderDetails?.streetNumber ?? null,
      additional_info: body.orderDetails?.other ?? null,
      office_code: body.orderDetails?.officeCode ?? null,
    };

    const orderMethods = {
      delivery_method: body?.orderMethods?.deliveryMethod,
      payment_method: body?.orderMethods?.paymentMethod,
      delivery_cost: body?.orderMethods?.deliveryCost,
    };

    const { data, error } = await supabase.rpc('purchase_order', {
      p_user_id: body.metadata?.supabaseUserId ?? null,
      p_items: dbItems,
      p_shipping: shippingDetails,
      p_order_methods: orderMethods,
    });

    if (error) {
      console.error('Supabase RPC error:', error);
      return NextResponse.json(
        { success: false, error: 'Database error', details: error.message },
        { status: 500 },
      );
    }

    if (!data || !data.success) {
      return NextResponse.json(
        { success: false, error: data?.error || 'Purchase failed' },
        { status: 400 },
      );
    }

    if (data) {
      console.log('RETURNED DATA', data);
    }

    return NextResponse.json(
      {
        success: true,
        order_id: data.order_id,
        total_amount: data.total_amount,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error('Error submiting cash order', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        details: error.message,
      },
      { status: 500 },
    );
  }
};

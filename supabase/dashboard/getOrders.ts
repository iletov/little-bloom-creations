import { createClient } from '@/lib/supabaseServer';

export async function getOrders() {
  const supabase = await createClient();

  const { data: recentOrdersData } = await supabase
    .from('orders')
    .select(
      `
      order_number,
      created_at,
      status,
      delivery_method,
      payment_method,
      total_amount,
      subtotal,
      delivery_cost,
      order_shipping (
        email,
        full_name
      )
      `,
    )
    .order('created_at', { ascending: false })
    .limit(10);

  console.log('Raw Orders Data:', JSON.stringify(recentOrdersData, null, 2));

  const recentOrders = recentOrdersData
    ? recentOrdersData.map((order: any) => ({
        order_number: order.order_number,
        created_at: order.created_at,
        status: order.status,
        delivery_method:
          order.delivery_method.includes('office') ||
          order.delivery_method.includes('pickup')
            ? 'office'
            : 'delivery',
        delivery_company: order.delivery_method.startsWith('ekont')
          ? 'ekont'
          : 'speedy',
        payment_method: order.payment_method,
        subtotal: order.subtotal,
        email: order.order_shipping?.email || 'N/A',
        full_name: order.order_shipping?.full_name || 'Guest',
      }))
    : [];

  const { data: allOrdersData } = await supabase
    .from('orders')
    .select(
      `
      order_number,
      created_at,
      status,
      delivery_method,
      payment_method,
      delivery_cost,
      total_amount,
      subtotal,
      order_shipping (
        email,
        full_name,
        phone,
        city    
      )
      `,
    )
    .order('created_at', { ascending: false });

  const allOrders = allOrdersData
    ? allOrdersData.map((order: any) => ({
        order_number: order.order_number,
        created_at: order.created_at,
        status: order.status,
        delivery_method:
          order.delivery_method.includes('office') ||
          order.delivery_method.includes('pickup')
            ? 'office'
            : 'delivery',
        delivery_company: order.delivery_method.startsWith('ekont')
          ? 'ekont'
          : 'speedy',
        payment_method: order.payment_method,
        subtotal: order.subtotal,
        email: order.order_shipping?.email || 'N/A',
        full_name: order.order_shipping?.full_name || 'Guest',
      }))
    : [];

  return {
    recentOrders,
    allOrders: allOrders || [],
  };
}

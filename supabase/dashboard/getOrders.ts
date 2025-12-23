import { createClient } from '@/lib/supabaseServer';

export async function getOrders() {
  const supabase = await createClient();

  const { data: recentOrders } = await supabase
    .from('orders')
    .select(
      `
      order_number,
      created_at,
      status,
      delivery_method,
      payment_method,
      total_amount,
      order_shipping (
        email,
        full_name
      )
      `,
    )
    .order('created_at', { ascending: false })
    .limit(5);

  console.log('Raw Orders Data:', JSON.stringify(recentOrders, null, 2));

  if (!recentOrders) return [];

  return recentOrders.map((order: any) => ({
    order_number: order.order_number,
    created_at: order.created_at,
    status: order.status,
    delivery_method: order.delivery_method.startsWith('ekont')
      ? 'ekont'
      : 'speedy',
    payment_method: order.payment_method,
    total_amount: order.total_amount,
    email: order.order_shipping?.email || 'N/A',
    full_name: order.order_shipping?.full_name || 'Guest',
  }));
}

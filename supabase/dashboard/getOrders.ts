import { createClient, createServiceClient } from '@/lib/supabaseServer';
import { unstable_cache } from 'next/cache';

// Helper function to transform order data
function transformOrders(orders: any[]) {
  return orders.map((order: any) => ({
    ...order,
    delivery_method:
      order.delivery_method.includes('office') ||
      order.delivery_method.includes('pickup')
        ? 'office'
        : 'delivery',
    delivery_company: order.delivery_method.startsWith('ekont')
      ? 'ekont'
      : 'speedy',
  }));
}

const orderParameters = `
      order_number,
      created_at,
      status,
      delivery_method,
      payment_method,
      delivery_cost,
      total_amount,
      subtotal,
      shipment_number,
      `;

export const getOrders = unstable_cache(
  async () => {
    const supabase = createServiceClient();
    const orderQuery =
      orderParameters +
      `
      order_shipping (
        full_name,
        email
      )
    `;

    const { data: recentOrdersData, error } = await supabase
      .from('orders')
      .select(orderQuery)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Supabase query error:', error);
    }

    const recentOrders = recentOrdersData
      ? transformOrders(recentOrdersData)
      : [];

    const { data: allOrdersData } = await supabase
      .from('orders')
      .select(orderQuery)
      .order('created_at', { ascending: false });

    const allOrders = allOrdersData ? transformOrders(allOrdersData) : [];

    return {
      recentOrders,
      allOrders: allOrders || [],
    };
  },
  ['dashboard-orders'],
  {
    tags: ['dashboard-orders'],
    revalidate: 360,
  },
);

export const getSingleOrder = (id: string) => {
  return unstable_cache(
    async () => {
      const supabase = createServiceClient();

      const orderQuery = orderParameters + `order_shipping (*),order_items (*)`;

      const { data: orderData, error } = await supabase
        .from('orders')
        .select(orderQuery)
        .eq('order_number', id)
        .single();

      if (error || !orderData) {
        console.error('Supabase query error:', error);
        return null;
      }

      const order = orderData as any;

      const transformedOrder = {
        ...order,
        delivery_method:
          order.delivery_method.includes('office') ||
          order.delivery_method.includes('pickup')
            ? 'office'
            : 'delivery',
        delivery_company: order.delivery_method.startsWith('ekont')
          ? 'ekont'
          : 'speedy',
      };

      return transformedOrder;
    },
    ['single-order', id],
    {
      tags: ['single-order', id],
      revalidate: 360,
    },
  )();
};

// For use in generateStaticParams (build time)
export async function getOrdersForStaticParams() {
  const { createServiceClient } = await import('@/lib/supabaseServer');
  const supabase = createServiceClient();

  const { data: allOrdersData } = await supabase
    .from('orders')
    .select('order_number')
    .order('created_at', { ascending: false });

  return allOrdersData || [];
}

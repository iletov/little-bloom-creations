'use server';

import { createClient } from '@/lib/supabaseServer';

export async function updateOrder(
  orderId: string,
  updates: { [key: string]: any },
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('orders')
    .update(updates)
    .eq('order_number', orderId)
    .select()
    .single();

  if (error) {
    console.error('Error updating order:', error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

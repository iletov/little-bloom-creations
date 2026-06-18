'use server';

import { createClient } from '@/lib/supabaseServer';

export async function updateOrder(
  orderId: string,
  updates: Record<string, unknown>,
) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  const token = session?.access_token || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!token) {
    return { success: false, error: 'Unauthorized' };
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  try {
    const response = await fetch(`${apiUrl}/admin/orders/${orderId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      console.error('Error updating order:', await response.text());
      return { success: false, error: 'Failed to update order' };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error in updateOrder fetch:', error);
    return { success: false, error: 'Internal error' };
  }
}

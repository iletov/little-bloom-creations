'use server';

import { createClient } from '@/lib/supabaseServer';
import { revalidatePath } from 'next/cache';

async function getAuthToken() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;
}

export async function generateWaybill(orderId: string) {
  const token = await getAuthToken();
  if (!token) return { success: false, error: 'Unauthorized' };

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  try {
    const response = await fetch(`${apiUrl}/admin/orders/${orderId}/waybill`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const err = await response.text();
      return { success: false, error: err };
    }

    const data = await response.json();
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/orders');
    return { success: true, data };
  } catch (error) {
    return { success: false, error: 'Internal error' };
  }
}

export async function cancelOrder(orderId: string) {
  const token = await getAuthToken();
  if (!token) return { success: false, error: 'Unauthorized' };

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  try {
    const response = await fetch(`${apiUrl}/admin/orders/${orderId}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const err = await response.text();
      return { success: false, error: err };
    }

    const data = await response.json();
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/orders');
    return { success: true, data };
  } catch (error) {
    return { success: false, error: 'Internal error' };
  }
}

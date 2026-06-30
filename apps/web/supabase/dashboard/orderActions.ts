'use server';

import { createClient } from '@/lib/supabaseServer';
import { apiConfig } from '@/lib/api/api-config';
import { revalidatePath } from 'next/cache';

async function getAuthToken() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || process.env.SUPABASE_SERVICE_ROLE_KEY;
}

export async function generateWaybill(orderId: string) {
  const token = await getAuthToken();
  if (!token) return { success: false, error: 'Unauthorized' };

  const apiUrl = apiConfig.baseUrl;

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

  const apiUrl = apiConfig.baseUrl;

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

export async function markOrderAsDelivered(orderId: string) {
  const token = await getAuthToken();
  if (!token) return { success: false, error: 'Unauthorized' };

  const apiUrl = apiConfig.baseUrl;

  try {
    const response = await fetch(`${apiUrl}/admin/orders/${orderId}/deliver`, {
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
    revalidatePath(`/dashboard/orders/${orderId}`);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: 'Internal error' };
  }
}

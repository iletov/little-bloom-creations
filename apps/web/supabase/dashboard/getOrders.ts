import { createClient } from '@/lib/supabaseServer';
import { apiConfig } from '@/lib/api/api-config';
import { Order } from '@/types';

export async function getOrders() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  const token = session?.access_token || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!token) {
    console.error('Unauthorized access to getOrders');
    return { recentOrders: [], allOrders: [] };
  }

  const apiUrl = apiConfig.baseUrl;

  try {
    const response = await fetch(`${apiUrl}/admin/orders`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      next: {
        tags: ['dashboard-orders'],
        revalidate: 360,
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch orders:', await response.text());
      return { recentOrders: [], allOrders: [] };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching orders from NestJS:', error);
    return { recentOrders: [], allOrders: [] };
  }
}

export async function getSingleOrder(id: string) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  const token = session?.access_token || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!token) {
    console.error('Unauthorized access to getSingleOrder');
    return null;
  }

  const apiUrl = apiConfig.baseUrl;

  try {
    const response = await fetch(`${apiUrl}/admin/orders/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error(`Failed to fetch single order ${id}:`, await response.text());
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching single order from NestJS:', error);
    return null;
  }
}


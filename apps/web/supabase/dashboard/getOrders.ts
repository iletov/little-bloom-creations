import { createClient } from '@/lib/supabaseServer';

export async function getOrders() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  const token = session?.access_token || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;
  if (!token) {
    console.error('Unauthorized access to getOrders');
    return { recentOrders: [], allOrders: [] };
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

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

  const token = session?.access_token || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;
  if (!token) {
    console.error('Unauthorized access to getSingleOrder');
    return null;
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  try {
    const response = await fetch(`${apiUrl}/admin/orders/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      next: {
        tags: ['single-order', id],
        revalidate: 360,
      },
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

// For use in generateStaticParams (build time)
// For use in generateStaticParams (build time)
export async function getOrdersForStaticParams() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  try {
    const response = await fetch(`${apiUrl}/admin/orders`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) return [];
    
    const data = await response.json();
    return data.allOrders || [];
  } catch (error) {
    return [];
  }
}

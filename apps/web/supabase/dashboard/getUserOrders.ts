import { createClient } from '@/lib/supabaseServer';

export async function getUserOrders() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  const token = session?.access_token;
  if (!token) {
    return [];
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  try {
    const response = await fetch(`${apiUrl}/orders/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      next: {
        tags: ['user-orders'],
        revalidate: 0, // No cache for user specific data
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch user orders:', await response.text());
      return [];
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user orders from NestJS:', error);
    return [];
  }
}

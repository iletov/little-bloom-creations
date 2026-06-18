'use server';

import { createClient } from '@/lib/supabaseServer';

export async function getMetrics(days: number = 7) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  const token = session?.access_token || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!token) {
    console.error('Unauthorized access to getMetrics');
    return {
      todayRevenue: "0.00",
      todayOrdersCount: 0,
      pendingOrdersCount: 0,
      productsCount: 0,
      allRevenue: "0.00",
    };
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  
  try {
    const response = await fetch(`${apiUrl}/admin/metrics?days=${days}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.error('Failed to fetch metrics:', await response.text());
      throw new Error('Failed to fetch metrics');
    }

    const metrics = await response.json();
    return metrics;
  } catch (error) {
    console.error('Error fetching metrics from NestJS:', error);
    return {
      todayRevenue: "0.00",
      todayOrdersCount: 0,
      pendingOrdersCount: 0,
      productsCount: 0,
      allRevenue: "0.00",
    };
  }
}

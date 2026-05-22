'use server';

import { revalidatePath } from 'next/cache';

/**
 * Revalidate a specific order page
 * Call this after updating an order to refresh the cached data
 */
export async function revalidateOrder(orderId: string) {
  revalidatePath(`/dashboard/orders/${orderId}`);
}

/**
 * Revalidate all order pages
 * Call this when you need to refresh the entire orders list
 */
export async function revalidateAllOrders() {
  revalidatePath('/dashboard/orders');
  revalidatePath('/dashboard/orders/[id]', 'page');
}

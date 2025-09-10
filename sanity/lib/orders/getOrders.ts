import { defineQuery } from 'next-sanity';
import { sanityFetch } from '../live';

export const getOrders = async (userId: string) => {
  const ORDERS_QUERY = defineQuery(`
      *[_type == "order" && clerkUserId == $userId] | order(_createdAt desc) {
        ...,
        products[]{
          ...,
          product->
        },
      }
    `);

  try {
    const orders = await sanityFetch({
      query: ORDERS_QUERY,
      params: { userId },
    });
    return orders.data;
  } catch (error) {
    console.error('Error fetching orders', error);
    return [];
  }
};

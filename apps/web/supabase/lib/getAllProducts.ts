import { unstable_cache } from 'next/cache';
import { apiConfig } from '@/lib/api/api-config';

const API_URL = apiConfig.baseUrl;

export const getAllProducts = unstable_cache(
  async () => {
    try {
      const res = await fetch(`${API_URL}/products`, {
        next: { tags: ['dashboard-products'], revalidate: 360 },
      });
      if (!res.ok) throw new Error('Failed to fetch products');
      return res.json();
    } catch (error) {
      console.error('Error fetching products from NestJS:', error);
      return null;
    }
  },
  ['dashboard-products'],
  {
    tags: ['dashboard-products'],
    revalidate: 360,
  },
);

export const getProductVariants = unstable_cache(
  async () => {
    // In NestJS, variants are returned nested inside products.
    // If we need a flat list of variants, we can extract them from getAllProducts.
    try {
      const products = await getAllProducts();
      if (!products) return null;
      
      const variants = products.flatMap((p: any) => p.variants || []);
      return variants;
    } catch (error) {
      console.error('Error fetching product variants:', error);
      return null;
    }
  },
  ['dashboard-product-variants'],
  {
    tags: ['dashboard-product-variants'],
    revalidate: 360,
  },
);

export const getSingleProduct = async (sku: string) => {
  try {
    const res = await fetch(`${API_URL}/products/${sku}`, {
      next: { tags: [`product-${sku}`], revalidate: 0 }, // dynamic fetch for admin
    });
    if (!res.ok) throw new Error(`Failed to fetch product ${sku}`);
    return res.json();
  } catch (error) {
    console.error(`Error fetching single product ${sku}:`, error);
    return null;
  }
};


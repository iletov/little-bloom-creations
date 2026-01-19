import { createClient, createServiceClient } from '@/lib/supabaseServer';
import { unstable_cache } from 'next/cache';

export const getAllProducts = unstable_cache(
  async () => {
    const supabase = createServiceClient();

    const { data, error } = await supabase.from('products').select('*');

    if (error) {
      console.error('Error fetching products from Supabase:', error);
      return null;
    }

    return data;
  },
  ['dashboard-products'],
  {
    tags: ['dashboard-products'],
    revalidate: 360,
  },
);

export const getProductVariants = unstable_cache(
  async () => {
    const supabase = createServiceClient();

    const { data: variants, error } = await supabase
      .from('product_variants')
      .select('*')
      .order('parent_sku', { ascending: true });

    if (error) {
      console.error('Error fetching product variants from Supabase:', error);
      return null;
    }

    return variants;
  },
  ['dashboard-product-variants'],
  {
    tags: ['dashboard-product-variants'],
    revalidate: 360,
  },
);

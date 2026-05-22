import { createClient } from '@/lib/supabaseServer';

export async function getProductBySku(sku: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('products')
    .select('*, variants:product_variants!product_variants_parent_sku_fkey(*)')
    .eq('sku', sku)
    .eq('is_active', true)
    .maybeSingle();

  if (error) {
    console.error('Error fetching product from Supabase:', error);
    return null;
  }

  return data;
}

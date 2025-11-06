import { createClient } from '@/lib/supabaseServer';

export async function getProductBySku(sku: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('sku', sku)
    .single();

  if (error) {
    console.error('Error fetching product from Supabase:', error);
    return null;
  }

  return data;
}

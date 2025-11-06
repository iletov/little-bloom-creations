import { createClient } from '@/lib/supabaseServer';

export async function getAllProducts() {
  const supabase = await createClient();

  const { data, error } = await supabase.from('products').select('*');

  if (error) {
    console.error('Error fetching products from Supabase:', error);
    return null;
  }

  return data;
}

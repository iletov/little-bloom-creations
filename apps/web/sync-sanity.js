const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Ръчно зареждане на .env.local, тъй като сме в обикновен Node скрипт
const envPath = path.join(__dirname, '.env.local');
const envFile = fs.readFileSync(envPath, 'utf-8');
const envVars = {};

envFile.split('\n').forEach(line => {
  const match = line.match(/^([^#\s][^=]+)=(.*)$/);
  if (match) {
    let val = match[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
    envVars[match[1].trim()] = val;
  }
});

const SUPABASE_URL = envVars.NEXT_PUBLIC_SUPABASE_URL;
// Използваме service_role_key ако го има, за да сме сигурни, че имаме права за запис
const SUPABASE_KEY = envVars.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SANITY_PROJECT_ID = envVars.NEXT_PUBLIC_SANITY_PROJECT_ID;
const SANITY_DATASET = envVars.NEXT_PUBLIC_SANITY_DATASET;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function fetchSanityProducts() {
  const query = encodeURIComponent(`*[_type == "productType"]{_id, sku, name, price, "variants": variants[]{name, price, sku, stock, inStock}}`);
  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2025-01-01/data/query/${SANITY_DATASET}?query=${query}`;
  
  const res = await fetch(url);
  const json = await res.json();
  return json.result || [];
}

async function sync() {
  console.log('Fetching products from Sanity...');
  const products = await fetchSanityProducts();
  console.log(`Found ${products.length} products in Sanity.`);
  
  for (const product of products) {
    const { _id, sku, name, price, variants } = product;
    
    if (!sku) {
      console.log(`[SKIP] Product "${name}" has no SKU.`);
      continue;
    }
    
    console.log(`[SYNC] Upserting product: ${sku} (${name})`);
    
    // Създаваме продукта в Supabase
    const { data: productData, error: productError } = await supabase
        .from('products')
        .upsert(
          { sku, price, name, is_active: true, current_stock: product.stock || 0 },
          { onConflict: 'sku' }
        )
        .select()
        .single();
        
    if (productError) {
      console.error(`  -> Failed to upsert ${sku}:`, productError.message);
      continue;
    }
    
    if (variants && variants.length > 0) {
      const variantsToInsert = variants.map(v => ({
          parent_id: productData.id,
          variant_sku: v.sku,
          variant_name: v.name,
          current_stock: v.stock || 0,
          price: v.price || 0,
          is_active: v.inStock !== false,
      }));
      
      const { error: variantsError } = await supabase
          .from('product_variants')
          .upsert(variantsToInsert, { onConflict: 'variant_sku' });
          
      if (variantsError) {
        console.error(`  -> Failed to upsert variants for ${sku}:`, variantsError.message);
      } else {
        console.log(`  -> Variants synced successfully`);
      }
    }
  }
  console.log('\n✅ Full sync from Sanity to Supabase is complete!');
}

sync();

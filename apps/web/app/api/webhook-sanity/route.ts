import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';
import crypto from 'crypto';

// const verifySignature = (body: string, signature: string): boolean => {
//   const secret = process.env.SANITY_WEBHOOK_SECRET;
//   const hash = crypto.createHmac('sha256', secret!).update(body).digest('hex');
//   return hash === signature;
// };

export async function POST(req: NextRequest) {
  const headersList = await headers();
  const signature = headersList.get('sanity-webhook-signature');
  const body = await req.text();

  if (!signature) {
    return NextResponse.json(
      { message: 'No signature found' },
      { status: 403 },
    );
  }

  if (!body || body.trim() === '') {
    console.error('Empty request body received');
    return NextResponse.json(
      { message: 'Empty request body' },
      { status: 400 },
    );
  }

  // if (signature && !verifySignature(body, signature)) {
  //   console.error('Invalid signature');
  //   return NextResponse.json({ message: 'Invalid signature' }, { status: 403 });
  // }

  try {
    const payload = JSON.parse(body);

    const { _id, sku, name, price } = payload;

    const supabase = await createClient();

    if (!supabase) {
      return NextResponse.json(
        { error: 'Error connecting to Supabase' },
        { status: 500 },
      );
    }

    const eventType = payload._type;

    console.log('===Sanity Webhook Received===', eventType, payload?.name);

    const handleProductUsert = async (product: any) => {
      console.log(`# ---Sync product to Supabase: ${sku} (${name}) `);

      const { data: productData, error: productError } = await supabase
        .from('products')
        .upsert(
          {
            sanity_id: _id,
            sku: sku,
            price: price,
            name: name,
          },
          {
            onConflict: 'sku',
            // ignoreDuplicates: false,
          },
        )
        .select()
        .single();

      if (productError) {
        console.error('Failed to upsert product:', productError);
        throw new Error(`Product upsert failed: ${productError.message}`);
      }

      console.log('# ---Product upserted:', productData.id);

      //get existing variants

      const { data: existingVariants } = await supabase
        .from('product_variants')
        .select('variant_sku')
        .eq('parent_sku', sku);

      const existingVariantSkus = new Set(
        existingVariants?.map((v: any) => v?.variant_sku) || [],
      );

      const currentVariantSkus = new Set(
        (product?.variants ?? []).map((v: any) => v.sku),
      );

      const variantsToDelete = Array.from(existingVariantSkus).filter(
        vSku => !currentVariantSkus.has(vSku),
      );

      if (variantsToDelete?.length > 0) {
        console.log('# ---Deleting removed variants:', variantsToDelete);

        const { error: deleteError } = await supabase
          .from('product_variants')
          .delete()
          .in('variant_sku', variantsToDelete);

        if (deleteError) {
          console.error('Failed to delete variants:', deleteError);
        }
      }

      if (product?.variants?.length > 0) {
        const variantsToInsert = product?.variants.map((variant: any) => ({
          product_id: productData?.id,
          parent_sku: sku,
          variant_sku: variant?.sku,
          variant_name: variant?.name,
          // variant_type: variant.variantType,
          current_stock: variant?.stock || 0,
          price: variant?.price || 0,
          is_active: variant?.inStock !== false,
          updated_at: new Date().toISOString(),
        }));

        console.log('# ---Upserting variants---', variantsToInsert.length);

        const { error: variantsError } = await supabase
          .from('product_variants')
          .upsert(variantsToInsert, {
            onConflict: 'variant_sku',
            ignoreDuplicates: false,
          });

        if (variantsError) {
          console.error('Failed to upsert variants:', variantsError);
          throw new Error(`Variants upsert failed: ${variantsError.message}`);
        }

        console.log('# ---Variants synced successfully');
      }
      console.log(
        `Product ${sku} synced successfully with -${product.variants?.length ?? 0}- variants`,
      );
    };

    const handleProductDelete = async (product: any) => {
      console.log(`---Sync product to Supabase: ${sku} (${name}) `);

      const { error: productError } = await supabase
        .from('products')
        .delete()
        .eq('sku', sku);

      if (productError) {
        console.error('Failed to delete product:', productError);
        throw new Error(`Product delete failed: ${productError.message}`);
      }

      console.log('# ---Product deleted:', sku);
    };

    if (payload._type === 'productType') {
      if (eventType === 'delete') {
        await handleProductDelete(payload);
      } else {
        await handleProductUsert(payload);
      }
    }

    return NextResponse.json(
      { success: true, message: '!!!---Sanity Webhook Processed---!!!' },
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    console.log('Error verifying Sanity signature', error);
    return NextResponse.json(
      { error: 'Error verifying Sanity signature' },
      { status: 500 },
    );
  }
}

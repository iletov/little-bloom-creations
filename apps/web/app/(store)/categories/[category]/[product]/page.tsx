import React from 'react';
import ProductContainer from '@/component/products/ProductContainer';
import SectionRenderer from '@/component/section-renderer/SectionRenderer';
import { getProduct, getProducts } from '@/sanity/lib/fetch/fetchData';
import { getProductBySku } from '@/supabase/lib/getProductBySku';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{
    category: string | undefined;
    product: string | undefined;
  }>;
}

export async function generateStaticParams() {
  const allProducts = await getProducts();

  return allProducts
    ?.filter(
      (product: any) =>
        product?.slug?.current && product?.category?.slug?.current,
    )
    .map((product: any) => ({
      product: product.slug.current,
      category: product.category.slug.current,
    }));
}

export default async function Product({ params }: Props) {
  // console.log('params', await params);

  const { category, product } = await params;

  const sanityData = await getProduct(category, product);

  if (!sanityData || !sanityData.sku) {
    console.error('NOT FOUND. sanityData:', !!sanityData, 'sku:', sanityData?.sku);
    return notFound();
  }

  const supabaseData = await getProductBySku(sanityData.sku);
  if (!supabaseData) {
    console.error('NOT FOUND IN SUPABASE. sku:', sanityData.sku);
    return notFound();
  }
  const mergeVariants = (sanityVariants: any[], supabaseVariants: any[]) => {
    return supabaseVariants.map((sbVariant: any) => {
      const sbSku = sbVariant.variantSku || sbVariant.variant_sku;
      const match = sanityVariants.find(
        sv => sv.sku === sbSku,
      );

      return {
        ...sbVariant,
        variant_sku: sbSku,
        variant_name: sbVariant.variantName || sbVariant.variant_name,
        product_id: sbVariant.parentId || sbVariant.product_id,
        images: match?.images || [],
        color: match?.color || null,
        weight: match?.weight || null,
        width: match?.width || null,
        height: match?.height || null,
        depth: match?.depth || null,
      };
    });
  };

  const completeVariants = mergeVariants(
    sanityData?.variants || [],
    supabaseData?.variants || [],
  );

  const data = {
    ...sanityData,
    ...supabaseData,
    name: sanityData?.name,
    supabase_name: supabaseData?.name,
    category: sanityData?.category,
    price: supabaseData?.price || sanityData?.price,
    variants: completeVariants,
  };

  // console.log(`category '${category}' for product '${product}'`, data);

  return (
    <section className="max-w-[1280px] mx-auto w-full pt-40">
      {/* <Todo /> */}
      <ProductContainer data={data} />
      <SectionRenderer sections={sanityData?.additionalSections} />
    </section>
  );
}

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

  return allProducts?.map((product: any) => ({
    product: product?.slug.current,
    category: product?.category?.slug.current,
  }));
}

export default async function Product({ params }: Props) {
  console.log('params', await params);

  const { category, product } = await params;

  const sanityData = await getProduct(category, product);

  const supabaseData = await getProductBySku(sanityData?.sku as string);
  if (!sanityData || !supabaseData) return notFound();

  const mergeVariants = (sanityVariants: any[], supabaseVariants: any[]) => {
    return supabaseVariants.map((sbVariant: any) => {
      const match = sanityVariants.find(
        sv => sv.sku === (sbVariant?.variant_sku as string),
      );

      return {
        ...sbVariant,
        images: match?.images || [],
        color: match?.color || null,
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
    variants: completeVariants,
  };

  console.log(`category '${category}' for product '${product}'`, data);

  return (
    <section className="max-w-[1280px] mx-auto w-full pt-40">
      {/* <Todo /> */}
      <ProductContainer data={data} />
      <SectionRenderer sections={sanityData?.additionalSections} />
    </section>
  );
}

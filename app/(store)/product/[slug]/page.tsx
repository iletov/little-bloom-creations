import ProductContainer from '@/component/products/ProductContainer';
import SectionRenderer from '@/component/section-renderer/SectionRenderer';
import { getProductBySlug, getProducts } from '@/sanity/lib/fetch/fetchData';
import { getProductBySku } from '@/supabase/lib/getProductBySku';
import { notFound } from 'next/navigation';
import React from 'react';

interface Props {
  params: Promise<{ slug: string | undefined }>;
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products?.map((product: { slug: { current: string } }) => ({
    slug: product.slug.current,
  }));
}

export const revalidate = 1800;

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  if (!slug) return notFound();

  const sanityData = await getProductBySlug(slug);
  if (!sanityData) return notFound();

  const supabaseData = await getProductBySku(sanityData?.sku as string);

  const data = {
    ...sanityData,
    ...supabaseData,
  };

  console.log('PRODUCTS', sanityData);

  return (
    <>
      <section className="max-w-[1280px] mx-auto w-full pt-40">
        {/* <Todo /> */}
        <ProductContainer data={data} />
        <SectionRenderer sections={sanityData?.additionalSections} />
      </section>
    </>
  );
}

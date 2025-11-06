import { PortableTextContainer } from '@/component/portabletext-container/PortableTextContainer';
import ProductContainer from '@/component/products/ProductContainer';
import SectionRenderer from '@/component/section-renderer/SectionRenderer';
import Todo from '@/component/todo-supabase/Todo';
import { getProductBySlug } from '@/sanity/lib/fetch/fetchData';
import { getProductBySku } from '@/supabase/lib/getProductBySku';

import { notFound } from 'next/navigation';
import React from 'react';

interface Props {
  params: Promise<{ slug: string | undefined }>;
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  if (!slug) return notFound();

  const sanityData = await getProductBySlug(slug);
  if (!sanityData) return notFound();

  // console.log(`Product/${slug} ->`, product);

  const supabaseData = await getProductBySku(sanityData?.sku as string);

  // console.log('Supabase Data', supabaseData);

  const data = {
    ...sanityData,
    ...supabaseData,
  };

  console.log('MERGED DATA ->>', data);

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

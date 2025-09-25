import { PortableTextContainer } from '@/component/portabletext-container/PortableTextContainer';
import SectionRenderer from '@/component/section-renderer/SectionRenderer';
import { getProductBySlug } from '@/sanity/lib/fetch/fetchData';
import { notFound } from 'next/navigation';
import React from 'react';

interface Props {
  params: Promise<{ slug: string | undefined }>;
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  if (!slug) return notFound();

  const product = await getProductBySlug(slug);
  if (!product) return notFound();

  console.log(`Product/${slug} ->`, product);

  return (
    <>
      <section>
        <header>
          <h1 className="text-[4rem]">{product?.name}</h1>
          <PortableTextContainer data={product?.description} />
        </header>
        <SectionRenderer sections={product?.additionalSections} />
      </section>
    </>
  );
}

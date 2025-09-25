import SectionRenderer from '@/component/section-renderer/SectionRenderer';
import { getAllCategories, getPageData } from '@/sanity/lib/fetch/fetchData';
import { notFound } from 'next/navigation';
import React from 'react';

interface Props {
  params: Promise<{ slug: string | undefined }>;
}

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories?.map((category: { slug: { current: string } }) => ({
    slug: category.slug.current,
  }));
}

// export const dynamicParams = true;
export const revalidate = 1800;
export default async function Product({ params }: Props) {
  const { slug } = await params;

  if (!slug) return notFound();

  const page = await getPageData(slug);
  if (!page) return notFound();

  console.log(`${slug} category ->`, page);

  return (
    <>
      {/* <StructuredData data={websiteSchema} /> */}
      <section>
        <SectionRenderer sections={page?.sections} />
      </section>
    </>
  );
}

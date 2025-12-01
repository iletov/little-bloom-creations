import SectionRenderer from '@/component/section-renderer/SectionRenderer';
import {
  getAllCategories,
  getPageData,
  getProductsByCategory,
} from '@/sanity/lib/fetch/fetchData';
import { notFound } from 'next/navigation';
import React from 'react';

interface Props {
  params: Promise<{ category: string | undefined }>;
}

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories?.map((category: { slug: { current: string } }) => ({
    category: category.slug.current,
  }));
}

// export const dynamicParams = true;
export const revalidate = 1800;
export default async function Product({ params }: Props) {
  // console.log('params', await params);

  const { category } = await params;

  if (!category) return notFound();

  const page = await getPageData(category);
  // const products = await getProductsByCategory(category);

  if (!page) return notFound();

  // console.log(`products for '${category}' page`, products);
  console.log(` page for '${category}' category ->`, page);

  return (
    <>
      {/* <StructuredData data={websiteSchema} /> */}
      <section>
        <SectionRenderer sections={page?.sections} />
      </section>
    </>
  );
}

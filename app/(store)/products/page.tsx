import SectionRenderer from '@/component/section-renderer/SectionRenderer';
import { getPageData } from '@/sanity/lib/fetch/fetchData';
import React from 'react';

export const dynamic = 'force-static';
export const revalidate = 3600;
export default async function ProductsPage() {
  const pageId = 'products';

  const page = await getPageData(pageId);

  console.log('products page->', page.sections);

  return (
    <>
      {/* <StructuredData data={websiteSchema} /> */}
      <section>
        <SectionRenderer sections={page?.sections} />
      </section>
    </>
  );
}

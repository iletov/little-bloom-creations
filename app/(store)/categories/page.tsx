import SectionRenderer from '@/component/section-renderer/SectionRenderer';
import { getPageData } from '@/sanity/lib/fetch/fetchData';
import React from 'react';

export const dynamic = 'force-static';
export const revalidate = 3600;
export default async function Categories() {
  const pageId = 'categories';

  const page = await getPageData(pageId);

  console.log('categories page->', page.sections);

  return (
    <>
      {/* <StructuredData data={websiteSchema} /> */}
      <section>
        <SectionRenderer sections={page?.sections} />
      </section>
    </>
  );
}

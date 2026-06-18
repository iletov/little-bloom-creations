import StructuredData from '@/component/Seo/StructuredData';
import { Metadata } from 'next';
import { getPageData } from '@/sanity/lib/fetch/fetchData';
import SectionRenderer from '@/component/section-renderer/SectionRenderer';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Начална страница | Little Bloom Creations',
    description: 'Официален сайт на Little Bloom Creations - Уникални персонализирани подаръци и декорации.',
    openGraph: {
      title: 'Little Bloom Creations - Официален сайт',
      description: 'Уникални персонализирани подаръци и декорации.',
      url: process.env.NEXT_PUBLIC_SITE_URL,
      siteName: 'Little Bloom Creations',
    },
  };
}

export const dynamic = 'force-static';
export const revalidate = 3600;

export default async function Home() {
  const pageId = 'home';

  const page = await getPageData(pageId);

  // console.log('pages', page.sections);

  const websiteSchema = {
    '@context': 'http://schema.org',
    '@type': 'WebSite',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    name: 'Little Bloom Creations',
    alternateName: 'Little Bloom Creations - Официален сайт',
  };

  return (
    <>
      <StructuredData data={websiteSchema} />
      <section>
        <SectionRenderer sections={page?.sections} />
      </section>
    </>
  );
}

import StructuredData from '@/component/Seo/StructuredData';
import { Metadata } from 'next';
import { getPageData } from '@/sanity/lib/fetch/fetchData';
import SectionRenderer from '@/component/section-renderer/SectionRenderer';

// export async function generateMetadata(): Promise<Metadata> {
//   const settings = await getBannerBySlug('/');

//   return {
//     title: 'Начална страница',
//     description: 'Начална страница',
//     openGraph: {
//       title: ' - Официален сайт',
//       description: 'Начална страница',
//       url: process.env.NEXT_PUBLIC_SITE_URL,
//       images: [
//         {
//           url: urlFor(settings?.bannerImage?.[0]).width(1200).height(630).url(),
//           width: 1200,
//           height: 630,
//           alt: 'Little Bloom Creations',
//         },
//       ],
//     },
//   };
// }

export const dynamic = 'force-static';
export const revalidate = 3600;

export default async function Home() {
  const pageId = 'home';

  const page = await getPageData(pageId);

  console.log('pages', page.sections);

  // const websiteSchema = {
  //   '@context': 'http://schema.org',
  //   '@type': 'WebSite',
  //   url: process.env.NEXT_PUBLIC_SITE_URL,
  //   name: 'Little Bloom Creations',
  //   alternateName: 'Little Bloom Creations - Официален сайт',
  // };

  return (
    <>
      {/* <StructuredData data={websiteSchema} /> */}
      <section>
        <SectionRenderer sections={page?.sections} />
      </section>
    </>
  );
}

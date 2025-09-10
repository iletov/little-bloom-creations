import EventItemContainer from '@/component/products/EventItemContainer';
import StructuredData from '@/component/Seo/StructuredData';
import { getConcertsBySlug } from '@/sanity/lib/events/getConcertsBySlug';
import { getTemplatePages } from '@/sanity/lib/getTemplatePages';
import { urlFor } from '@/sanity/lib/image';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';

const _type = 'concertType';

interface Props {
  params: Promise<{ slug: string | undefined }>;
}

export async function generateStaticParams() {
  const template = await getTemplatePages(_type);
  return template?.map((page: { slug: { current: string } }) => ({
    slug: page.slug.current || [],
  }));
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { slug } = await params;

  const getCachedConcertFunction = getConcertsBySlug(slug ?? '');
  const track = await getCachedConcertFunction(slug ?? '');

  return {
    title: track?.heading,
    description: track?.description,
    keywords: ['Невена Цонева', 'Баш Бенд', `${track?.heading}`],
    openGraph: {
      title: track?.heading,
      description: track?.description,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/concerts/${track?.slug?.current}`,
      type: 'music.album',
      images: [
        {
          url: urlFor((track?.images ?? [])[0]).url(),
          width: 1200,
          height: 630,
          alt: track?.heading,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: track?.heading,
      description: track?.description,
      images: [
        {
          url: urlFor((track?.images ?? [])[0]).url(),
          width: 1200,
          height: 630,
          alt: track?.heading,
        },
      ],
    },
  };
}

export const dynamicParams = true;
export const revalidate = 1800;

export default async function ConcertPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const getCachedConcertFunction = getConcertsBySlug(slug);
  const concert = await getCachedConcertFunction(slug);

  // const products = await getAllProducts();

  if (!concert) return notFound();

  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': 'MusicRecording',
    name: concert.title,
    byArtist: {
      '@type': 'MusicGroup',
      name: 'Невена Цонева и Баш Бенд',
    },
    description: concert.description,
    datePublished: concert.date,
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/concerts/${slug}`,
    image: urlFor((concert?.images ?? [])[0]).url(),
  };

  return (
    <>
      <StructuredData data={pageSchema} />
      <section
        className={`concert-bg_gradient py-8 pd:my-12 text-foreground min-h-screen`}>
        <div className="section_wrapper_sm space-y-[40px] md:space-y-[80px]">
          <EventItemContainer event={concert} contact={false} />
          {/* {pageData?.switchEsotericaProducts || pageData?.switchMusicProducts ? (
          <ProductsView
          // products={products}
          products={[
            ...((pageData?.switchEsotericaProducts &&
            pageData?.esotericaProducts?.filter(Boolean)) ||
            []),
            ...((pageData?.switchMusicProducts &&
            pageData?.musicProducts?.filter(Boolean)) ||
            []),
            ]}
            bgColor="bg-neutral-950/15"
            heading={
              pageData?.musicProductsHeading?.heading ||
              pageData?.esotericaProductsHeading?.heading
            }
          />
        ) : null} */}
        </div>
      </section>
    </>
  );
}

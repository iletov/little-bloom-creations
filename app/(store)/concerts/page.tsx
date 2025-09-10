import { BannerBottomCurve } from '@/component/banner/banner-bottom-curve/BannerBottomCurve';
import { BannerFlat } from '@/component/banner/banner-flat/BannerFlat';
import { ContactUs } from '@/component/contact-form/ContactUs';
import { TitleDescription } from '@/component/esoterica-components/TitleDescription';
import { UpcomingEvents } from '@/component/esoterica-components/UpcomingEvents';
import StructuredData from '@/component/Seo/StructuredData';
import { getCardsData } from '@/lib/cms/getCardsData';
import { getMainPageData } from '@/lib/cms/getMainPageData';
import { cn } from '@/lib/utils';
import { BannerType, EventsType } from '@/sanity.types';
import { urlFor } from '@/sanity/lib/image';
import { getTemplateCards } from '@/sanity/lib/page/getTemplateCards';
import { getSectionsControler } from '@/sanity/lib/sections/getSectionsControler';
import { Metadata } from 'next';
import React from 'react';

export async function generateMetadata(): Promise<Metadata> {
  const controllers = await getSectionsControler();
  const { pageData } = await getMainPageData('music-store', controllers);
  return {
    title: 'Концерти - Невена & Баш Бенд',
    description:
      'Едно незабравимо музикално пътешествие с Невена Цонева и Баш Бенд',
    openGraph: {
      title: 'Концерти - Невена & Баш Бенд',
      description:
        'Едно незабравимо музикално пътешествие с Невена Цонева и Баш Бенд',
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/concerts/`,
      images: [
        {
          url: urlFor(pageData?.banner?.bannerImage?.[0]).url(),
          width: 1200,
          height: 630,
          alt: 'Концерти - Невена & Баш Бенд',
        },
      ],
    },
  };
}

export const dynamic = 'force-static';
export const revalidate = 3600;

export default async function Concerts() {
  const controllers = await getSectionsControler();
  const { pageData } = await getMainPageData('concerts', controllers);
  const navCards = await getCardsData('concerts');
  const concertTemplatesList = await getTemplateCards('concertType');

  const concertsCondition = concertTemplatesList?.length > 0;

  // const productsCondition =
  //   pageData?.musicProducts?.length > 0 &&
  //   controllers?.switchMusicProducts === true;

  const pageSchema = {
    '@context': 'http://schema.org',
    '@type': 'ItemList',
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/concerts/`,
    name: 'Концерти - Невена Цонева',
    numberOfItems: concertTemplatesList.length,
    itemListElement: concertTemplatesList.map((item: any, index: number) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.title,
      description: item.description,
      image: urlFor(item.images?.[0]).url(),
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/concerts/${item.slug.current}`,
      item: {
        '@type': 'MusicEvent',
        name: item.title,
        startDate: item.date,
        location: {
          '@type': 'Place',
          name: item.heading,
          address: {
            '@type': 'PostalAddress',
            addressLocality: item.location,
          },
        },
      },
    })),
  };

  return (
    <>
      <StructuredData data={pageSchema} />
      <section className="music-bg_gradient pt-4 pb-8 md:pb-12 min-h-[100dvh] ">
        {pageData?.banner ? (
          <BannerBottomCurve
            data={pageData?.banner as BannerType}
            subData={navCards}
          />
        ) : null}

        {/* {pageData?.titleDescriptionSection ? (
        <TitleDescription data={pageData?.titleDescriptionSection} />
        ) : null} */}
        {concertsCondition ? (
          <div className="section_wrapper_xs space-y-[40px] md:space-y-[80px] ">
            <UpcomingEvents
              data={concertTemplatesList as unknown as EventsType[]}
              eventType="concerts"
              heading={pageData?.concertsHeading?.heading}
              // sliceCount={4}
            />
          </div>
        ) : null}

        {/* {productsCondition ? (
          <ProductsView
          products={pageData?.musicProducts}
          bgColor="bg-secondaryPurple/15"
          heading={pageData?.musicProductsHeading?.heading}
          />
        ) : null} */}

        {pageData?.switchContactForm ? (
          <ContactUs contacts={pageData?.contactInfo as any} />
        ) : null}
      </section>
    </>
  );
}

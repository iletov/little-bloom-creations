import { BannerBottomCurve } from '@/component/banner/banner-bottom-curve/BannerBottomCurve';
import { ProductBanner } from '@/component/banner/product-banner/ProductBanner';
import { ContactUs } from '@/component/contact-form/ContactUs';
import { TitleDescription } from '@/component/esoterica-components/TitleDescription';
import { UpcomingEvents } from '@/component/esoterica-components/UpcomingEvents';
import SoundCloudSection from '@/component/musicStore-components/sound-cloud/SoundCloudSection';
import StructuredData from '@/component/Seo/StructuredData';
import { getCardsData } from '@/lib/cms/getCardsData';
import { getMainPageData } from '@/lib/cms/getMainPageData';
import { BannerType, EventsType, ImageType, Slug } from '@/sanity.types';
import { urlFor } from '@/sanity/lib/image';
import { getTemplateCards } from '@/sanity/lib/page/getTemplateCards';
import { getSectionsControler } from '@/sanity/lib/sections/getSectionsControler';
import { getSoundCloud } from '@/sanity/lib/youtube/getSoundCloud';
import { Metadata } from 'next';
import React from 'react';

export interface pagePropsParams {
  searchParams: {
    page?: string;
  };
}

export interface PaginatedGallery {
  images?: ImageType[];
  videos?: any;
  totalImages?: number;
  totalVideos?: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  // hasPreviousPage: boolean;
  slug?: Slug | undefined;
  videoCategories?: string | string[];
}

export async function generateMetadata(): Promise<Metadata> {
  const controllers = await getSectionsControler();
  const { pageData } = await getMainPageData('music-store', controllers);
  return {
    title: 'Невена & Баш Бенд',
    description:
      'Едно незабравимо музикално пътешествие с Невена Цонева и Баш Бенд',
    openGraph: {
      title: 'Невена & Баш Бенд - Невена Цонева',
      description:
        'Едно незабравимо музикално пътешествие с Невена Цонева и Баш Бенд',
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/music-store/`,
      images: [
        {
          url: urlFor(pageData?.banner?.bannerImage?.[0]).url(),
          width: 1200,
          height: 630,
          alt: 'Невена & Баш Бенд - Невена Цонева',
        },
      ],
    },
  };
}

export const dynamic = 'force-static';
export const revalidate = 3600;

export default async function StoreOne() {
  const slug = 'music-store';

  const controllers = await getSectionsControler();

  const { pageData, productBanner } = await getMainPageData(slug, controllers);
  const navCards = await getCardsData(slug);
  const tracks = await getSoundCloud();

  const concertTemplatesList = await getTemplateCards('concertType');

  const pageSchema = {
    '@context': 'http://schema.org',
    '@type': 'ItemList',
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/music-store/`,
    name: 'Концерти - Невена Цонева',
    numberOfItems: concertTemplatesList.length,
    itemListElement: concertTemplatesList.map((item: any) => ({
      '@type': 'ListItem',
      name: item.title,
      description: item.description,
      image: urlFor(item.images?.[0]).url(),
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/music-store/${item.slug.current}`,
    })),
  };

  // const productsCondition =
  //   pageData?.musicProducts?.length > 0 &&
  //   controllers?.switchMusicProducts === true;

  return (
    <>
      <StructuredData data={pageSchema} />
      <section className="music-bg_gradient pt-4 font-montserrat tracking-[0.03em] leading-[120%] pb-8 md:pb-12">
        {pageData?.banner ? (
          <BannerBottomCurve
            data={pageData?.banner as BannerType}
            subData={navCards}
          />
        ) : null}
        <div className="space-y-[40px] md:space-y-[80px]">
          {pageData?.titleDescriptionSection ? (
            <TitleDescription data={pageData?.titleDescriptionSection} />
          ) : null}

          <div className="section_wrapper_xs space-y-[40px] md:space-y-[80px]">
            {concertTemplatesList?.length > 0 ? (
              <UpcomingEvents
                data={concertTemplatesList as unknown as EventsType[]}
                eventType="concerts"
                heading={pageData?.concertsHeading?.heading}
                sliceCount={5}
              />
            ) : null}
          </div>
          {/* {productBanner ? <ProductBanner data={productBanner} /> : null} */}

          {tracks && tracks?.length > 0 ? (
            <SoundCloudSection
              data={tracks}
              heading={pageData?.soundCloudHeading?.heading}
            />
          ) : null}

          {/* {productsCondition ? (
          <>
          <FiltersSliderWrapper tag={music_tag[0]._id} />
          <ProductsView
          heading={pageData?.musicProductsHeading?.heading}
          products={pageData?.musicProducts}
          bgColor="bg-secondaryPurple/15"
          />
          </>
          ) : null} */}

          {pageData?.switchContactForm ? (
            <ContactUs contacts={pageData?.contactInfo as any} />
          ) : null}
        </div>
      </section>
    </>
  );
}

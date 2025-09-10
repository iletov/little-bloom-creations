import { BannerBottomCurve } from '@/component/banner/banner-bottom-curve/BannerBottomCurve';
import { TitleDescription } from '@/component/esoterica-components/TitleDescription';
import React from 'react';
import { BannerType } from '@/sanity.types';
import { getMainPageData } from '@/lib/cms/getMainPageData';
import { ContactUs } from '@/component/contact-form/ContactUs';
import { ProductBanner } from '@/component/banner/product-banner/ProductBanner';
import { getSectionsControler } from '@/sanity/lib/sections/getSectionsControler';
import { getYouTubeVids } from '@/sanity/lib/youtube/getYouTubeVids';
import YouTubeVideoSection from '@/component/musicStore-components/youtube/YouTubeVideoSection';
import { PaginatedGallery } from '../../(music-store)/music-store/page';
import { getCardsData } from '@/lib/cms/getCardsData';
import { Metadata } from 'next';
import { urlFor } from '@/sanity/lib/image';
import StructuredData from '@/component/Seo/StructuredData';

export async function generateMetadata(): Promise<Metadata> {
  const controllers = await getSectionsControler();
  const { pageData } = await getMainPageData('bez-granitsi', controllers);
  return {
    title: 'Без граници',
    description:
      ' Какъв цвят е аурата ви, какво означава той и защо преобладава? Живот преди, след или по време на смъртта?',
    openGraph: {
      title: 'Без граници - Невена Цонева',
      description:
        ' Какъв цвят е аурата ви, какво означава той и защо преобладава?',
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/bez-granitsi/`,
      images: [
        {
          url: urlFor(pageData?.banner?.bannerImage?.[0]).url(),
          width: 1200,
          height: 630,
          alt: 'Без граници - Невена Цонева',
        },
      ],
    },
  };
}

export const dynamic = 'force-static';
export const revalidate = 3600;

const _itemsPerPage = 8;

export default async function StoreTwo({ searchParams }: any) {
  const params = await searchParams;
  const page = parseInt(params?.page || '1') || 1;

  // Calculate pagination parameters
  const totalImagesToLoad = page * _itemsPerPage;
  const start = 0;
  const end = totalImagesToLoad;
  const pagination = { start, end };
  const slug = 'bez-granitsi';

  const controllers = await getSectionsControler();
  const { pageData } = await getMainPageData(slug, controllers);
  const videoCategories = ['putyat-kum-sebe-si', 'bez-granitsi'];
  const youtubeData = await getYouTubeVids(videoCategories, pagination);
  const youtubeCondition = youtubeData?.totalVideos > 0;

  const navCards = await getCardsData(slug);

  const totalPages = Math.ceil(youtubeData?.totalVideos / _itemsPerPage);

  const videos: PaginatedGallery = {
    videos: youtubeData || [],
    totalVideos: youtubeData?.totalVideos,
    currentPage: page,
    totalPages: totalPages,
    hasNextPage: page < totalPages,
    videoCategories: videoCategories,
  };

  const pageSchema = {
    '@context': 'http://schema.org',
    '@type': 'WebPage',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    name: 'Без граници - Невена Цонева',
    alternateName: 'Без граници - Невена Цонева - Официален сайт',
  };

  return (
    <>
      <StructuredData data={pageSchema} />
      <section
        className={`min-h-[100dvh] pt-4 esoterica-bg_gradient font-montserrat tracking-[0.03em] leading-[120%] pb-8 md:pb-12`}>
        {pageData?.banner ? (
          <BannerBottomCurve
            data={pageData?.banner as BannerType}
            subData={navCards}
          />
        ) : null}
        <div className="space-y-[30px] md:space-y-[80px]">
          {pageData?.titleDescriptionSection ? (
            <TitleDescription data={pageData?.titleDescriptionSection} />
          ) : null}

          {/* {productBanner ? <ProductBanner data={productBanner} /> : null} */}

          {/* {productsCondition ? (
            <>
              <FiltersSliderWrapper tag={music_tag[1]._id} />
              <ProductsView
                products={pageData?.esotericaProducts}
                bgColor="bg-neutral-950/15"
                heading={pageData?.esotericaProductsHeading?.heading}
              />
            </>
          ) : null} */}

          {youtubeCondition ? (
            <YouTubeVideoSection
              data={videos}
              // heading={pageData?.youtubeHeading?.heading}
            />
          ) : null}

          {pageData?.switchContactForm ? (
            <ContactUs contacts={pageData?.contactInfo as any} />
          ) : null}
        </div>
      </section>
    </>
  );
}

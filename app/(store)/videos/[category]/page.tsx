import { BannerBottomCurve } from '@/component/banner/banner-bottom-curve/BannerBottomCurve';
import { BannerType } from '@/sanity.types';
import { getBannerBySlug } from '@/sanity/lib/banner/getBannerByTitle';
import { getYouTubeVids } from '@/sanity/lib/youtube/getYouTubeVids';
import { getUniqueCategories } from '@/lib/cms/uniqueVideoCategories';
import React from 'react';
import { PaginatedGallery } from '../../(music-store)/music-store/page';
import YouTubeVideoSection from '@/component/musicStore-components/youtube/YouTubeVideoSection';
import { getCardsData } from '@/lib/cms/getCardsData';
import { Metadata } from 'next';
import { urlFor } from '@/sanity/lib/image';
import StructuredData from '@/component/Seo/StructuredData';

type PageProps = {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateStaticParams() {
  const categories = await getUniqueCategories();
  return categories.map(category => ({
    category,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category } = await params;
  const banner = await getBannerBySlug(category);

  return {
    title: `Видео - ${category}`,
    description: `Видео - ${category}`,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/videos/${category}/`,
    },
    openGraph: {
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/videos/${category}/`,
      type: 'website',
      images: [
        {
          url: urlFor(banner?.bannerImage?.[0]).width(1200).height(630).url(),
          width: 1200,
          height: 630,
          alt: `${category} Music Videos`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Видео - ${category}`,
      description: `Видео - ${category}`,
      images: [
        {
          url: urlFor(banner?.bannerImage?.[0]).width(1200).height(630).url(),
        },
      ],
    },
  };
}

export const dynamicParams = true;
export const revalidate = 1800;

const _itemsPerPage = 8;

export default async function VideoType({ searchParams, params }: PageProps) {
  const { category } = await params;
  const sParams = await searchParams;
  const page = parseInt(sParams?.page || '1') || 1;

  // Calculate pagination parameters
  const totalImagesToLoad = page * _itemsPerPage;
  const start = 0;
  const end = totalImagesToLoad;
  // const slug = 'music-store';
  const pagination = { start, end };

  const banner = await getBannerBySlug(category);

  const navCards = await getCardsData(`videos/${category}`);

  const youtubeData = await getYouTubeVids(category, pagination);

  const youtubeCondition = youtubeData?.totalVideos > 0;

  const totalPages = Math.ceil(youtubeData?.totalVideos / _itemsPerPage);

  const videos: PaginatedGallery = {
    videos: youtubeData || [],
    totalVideos: youtubeData?.totalVideos,
    currentPage: page,
    totalPages: totalPages,
    hasNextPage: page < totalPages,
    videoCategories: category,
  };

  const videoSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/videos/${category}/`,
    name: `Видео - ${category}`,
    description: `Видео - ${category}`,
    itemListElement: youtubeData?.videos?.map((item: any) => ({
      '@type': 'ListItem',
      position: item._id,
      name: item.videoTitle,
      url: item.url,
      embedUrl: item.url,
    })),
  };

  return (
    <>
      <StructuredData data={videoSchema} />
      <section
        className={`min-h-[100dvh] pt-4 about_us-bg_gradient font-montserrat tracking-[0.03em] leading-[120%] pb-8 md:pb-20 space-y-[30px] md:space-y-[80px]`}>
        {banner ? (
          <BannerBottomCurve data={banner as BannerType} subData={navCards} />
        ) : null}

        {youtubeCondition ? (
          <YouTubeVideoSection
            data={videos}
            // heading={pageData?.youtubeHeading?.heading}
          />
        ) : null}
      </section>
    </>
  );
}

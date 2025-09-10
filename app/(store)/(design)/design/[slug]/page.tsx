import {
  pagePropsParams,
  PaginatedGallery,
} from '@/app/(store)/(music-store)/music-store/page';
import { BannerBottomCurve } from '@/component/banner/banner-bottom-curve/BannerBottomCurve';
import { IconsCards } from '@/component/cards/IconsCards';
import EventContactFom from '@/component/contact-form/EventContactFom';
import { TitleDescription } from '@/component/esoterica-components/TitleDescription';
import { BentoGridGalleryImgAndVideo } from '@/component/gallery/BentoGridImgAndVideo';
import { getMainPageData } from '@/lib/cms/getMainPageData';
import { getDesignBySlug } from '@/sanity/lib/design/getDesignBySlug';
import { getTemplatePages } from '@/sanity/lib/getTemplatePages';
import { getSectionsControler } from '@/sanity/lib/sections/getSectionsControler';
import { notFound } from 'next/navigation';

import React from 'react';

interface TemplatePageProps {
  params: { slug: string };
  searchParams: { page?: string };
}

const _type = 'designType';

export async function generateStaticParams() {
  const template = await getTemplatePages(_type);
  return template?.map((page: { slug: { current: string } }) => ({
    slug: page.slug.current || [],
  }));
}

export const dynamicParams = true;
export const revalidate = 1800;

const _imagesPerPage = 12;
export default async function DesignPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: any;
}) {
  const sParams = await searchParams;
  const { slug } = await params;

  const page = parseInt(sParams?.searchParams?.page || '1') || 1;

  const totalImagesToLoad = page * _imagesPerPage;
  const start = 0;
  const end = totalImagesToLoad;

  // const controllers = await getSectionsControler();

  const getCachedDesignFunction = getDesignBySlug(slug, { start, end });
  const designs = await getCachedDesignFunction(slug, { start, end });

  // const { pageData } = await getMainPageData('template-design', controllers);

  // console.log('Designs', pageData);

  if (!designs) return notFound();

  const totalPages = Math.ceil(designs.totalImages / _imagesPerPage);

  const gallery: PaginatedGallery = {
    images: designs.images || [],
    totalImages: designs.totalImages,
    currentPage: page,
    totalPages,
    hasNextPage: page < totalPages,
    slug: designs.slug.current,
  };

  // console.log('design-template', gallery);

  const data = {
    banner: {
      title: designs?.title,
      slug: {
        current: 'design',
      },
      bannerImage: designs?.bannerImage,
      bannerImageMobile: designs?.bannerImageMobile,
    },
    cardsPresentation: designs?.navCards?.[0],
  };

  // console.log('design', designs);

  return (
    <section className="bg-foreground ">
      <div className="design-bg_gradient w-full min-h-[calc(100dvh-65px)] pb-8 md:pb-12">
        <BannerBottomCurve data={data?.banner as any} />
        <div className="space-y-[40px] md:space-y-[80px]">
          <TitleDescription data={designs} textColor="text-primaryPurple" />
          <IconsCards data={data?.cardsPresentation} />
          {/* <BentoGridGallery data={designs} styles="text-primaryPurple" /> */}
          <BentoGridGalleryImgAndVideo
            data={gallery}
            styles="text-primaryPurple"
          />

          <EventContactFom
            event={designs}
            id={designs?._id}
            bgColor="bg-transparent"
            textStyle="text-primaryPurple  [&>h4]:font-montserrat [&>h4]:heading2 [&>h4]:font-bold "
          />
        </div>
      </div>
    </section>
  );
}

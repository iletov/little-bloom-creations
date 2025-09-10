import { BannerFlat } from '@/component/banner/banner-flat/BannerFlat';
import Gallery from '@/component/gallery/Gallery';
import GalleryContainer from '@/component/gallery/GalleryContainer';
import { Heading } from '@/component/text/Heading';
import { getGallery } from '@/lib/cms/getGallery';
import { cn } from '@/lib/utils';
import { BannerType, ImageType, Slug } from '@/sanity.types';
import { getBannerBySlug } from '@/sanity/lib/banner/getBannerByTitle';
import { Metadata } from 'next';
import React from 'react';

export interface GalleryPageProps {
  _id: string;
  coverImage: string;
  date?: string;
  description?: string | null;
  imageCount?: number | undefined;
  images: ImageType[] | undefined;
  slug: Slug;
  title?: string;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Галерия - Невена Цонева',
    description: 'Галерия - Невена Цонева',
    openGraph: {
      title: 'Галерия - Невена Цонева',
      description: 'Галерия - Невена Цонева',
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/gallery`,
    },
  };
}

export const dynamic = 'force-static';
export const revalidate = 3600;

export default async function GalleryPage() {
  const categories = await getGallery();

  return (
    <section
      className={cn(
        'product-bg_gradient min-h-screen pb-8 md:pb-12 pt-16 md:pt-24',
      )}>
      <Heading
        data={'Галерия'}
        className=" heading2 mb-8 md:mb-12 flex-wrap max-w-[90%] mx-auto"
      />
      <Gallery data={categories} />
    </section>
  );
}

import AlbumPage from '@/component/gallery/AlbumPage';
import { getAlbumBySlug, getGallery } from '@/lib/cms/getGallery';
import { notFound } from 'next/navigation';
import React from 'react';
import { ImageType, Slug } from '@/sanity.types';
import { Metadata } from 'next';
import { urlFor } from '@/sanity/lib/image';
import StructuredData from '@/component/Seo/StructuredData';

export interface PaginatedGalleryAlbumProps {
  _id: string;
  coverImage: string;
  imageCount?: number | undefined;
  images: ImageType[] | undefined;
  videos?: any;
  totalImages?: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  date?: string;
  description?: string | null;
  title?: string;
  slug: Slug;
  videoCategories?: string | string[];
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const albums = await getGallery();
  return albums?.map((page: { slug: { current: string } }) => ({
    slug: page.slug.current || '',
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const album = await getAlbumBySlug(slug);

  if (!album)
    return {
      title: 'Албумът не е намерен',
      description: 'Търсеният албум не е намерен',
    };

  return {
    title: album.title,
    description: album.description,
    openGraph: {
      title: album.title,
      description: album.description,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/gallery/${album.slug.current}`,
      images: [
        {
          url: album.coverImage ? album?.coverImage : null,
          width: 1200,
          height: 630,
          alt: album.title,
        },
      ],
    },
  };
}

export const dynamicParams = true;
export const revalidate = 1800;

const _imagesPerPage = 6;

export default async function Album({
  searchParams,
  params,
}: {
  searchParams?: any;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sParams = await searchParams;
  const page = parseInt(sParams?.page || '1') || 1;

  // Calculate pagination parameters
  const totalImagesToLoad = page * _imagesPerPage;
  const start = 0;
  const end = totalImagesToLoad;
  const pagination = { start, end };

  const album = await getAlbumBySlug(slug, pagination);

  if (!album) return notFound();

  const totalPages = Math.ceil(album.totalImages / _imagesPerPage);

  const gallery: PaginatedGalleryAlbumProps = {
    _id: album._id || '',
    title: album.title || '',
    date: album.date || '',
    description: album.description || '',
    images: album.images || [],
    totalImages: album.totalImages,
    currentPage: page,
    hasNextPage: page < totalPages,
    totalPages,
    slug: album.slug.current,
    coverImage: album.coverImage,
  };

  const gallerySchema = {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: album.title,
    description: album.description,
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/gallery/${album.slug.current}`,
    image: album.images.map((image: any) => urlFor(image).url()),
  };

  return (
    <>
      <StructuredData data={gallerySchema} />
      <AlbumPage data={gallery} />;
    </>
  );
}

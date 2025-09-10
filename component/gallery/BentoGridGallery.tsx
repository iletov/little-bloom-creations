'use client';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import React, { useState } from 'react';
import { VideoComponentBig } from '../video-component/VideoComponentBig';
import {
  internalGroqTypeReferenceTo,
  SanityImageCrop,
  SanityImageHotspot,
  Slug,
} from '@/sanity.types';
import { urlFor } from '@/sanity/lib/image';
import { VideoComponentAspect } from '../video-component/VideoComponentAspect';

interface BentoGridGalleryProps {
  data: {
    title?: string;
    heading?: string;
    slug?: Slug;
    images?: Array<{
      asset?: {
        _ref: string;
        _type: 'reference';
        _weak?: boolean;
        [internalGroqTypeReferenceTo]?: 'sanity.imageAsset';
      };
      hotspot?: SanityImageHotspot;
      crop?: SanityImageCrop;
      _type: 'image';
      _key: string;
    }>;
    eventVideos?: Array<{
      _ref: string;
      _type: 'reference';
      _weak?: boolean;
      _key: string;
      [internalGroqTypeReferenceTo]?: 'video';
      videoFile?: {
        asset?: {
          _ref: string;
          _type: 'reference';
          _weak?: boolean;
          [internalGroqTypeReferenceTo]?: 'sanity.fileAsset';
        };
        url: string | null;
        _type: 'file';
      };
    }>;
  };
  styles?: string;
}

interface MediaItem {
  id?: string;
  type?: 'image' | 'video';
  src?: any;
  videoUrl?: any;
  thumbnailImage?: string;
  alt?: string;
}

export const BentoGridGallery = ({ data, styles }: BentoGridGalleryProps) => {
  const mediaItems: MediaItem[] = [];

  if (data?.images) {
    data?.images?.forEach((image, index) => {
      mediaItems.push({
        id: `image-${index}`,
        alt: 'bento grid image',
        type: 'image',
        src: image ?? '',
      });
    });
  }

  if (data?.eventVideos) {
    data?.eventVideos?.forEach((video, index) => {
      mediaItems.push({
        id: `video-${index}`,
        alt: 'bento grid video',
        type: 'video',
        videoUrl: video ?? '',
        // videoUrl: video?.videoFile?.url ?? '',
        // thumbnailImage: urlFor(video).url() ?? '',
      });
    });
  }

  const shuffledMediaItems = mediaItems.sort(() => Math.random() - 0.5);

  // console.log('BENTO', shuffledMediaItems);

  if (mediaItems.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Няма достъпни снимки</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className={cn(`heading2 font-bold text-center mb-8`, styles)}>
        Mixed Media Bento Gallery
      </h2>

      <div className="mb-4 text-center font-play text-sm text-gray-600">
        {data.images?.length || 0} Снимки • {data.eventVideos?.length || 0}{' '}
        Видео
      </div>

      <div className="bento-grid">
        {shuffledMediaItems.map((item, index) => (
          <div
            key={item.id} // Use proper unique key
            className={`bento-item bento-item-${(index % 8) + 1} group cursor-pointer`}>
            {item.type === 'video' ? (
              <VideoComponentAspect
                videoUrl={item?.videoUrl?.videoFile?.url ?? ''}
                // thumbnailImage={item?.thumbnailImage}
              />
            ) : (
              <>
                <Image
                  src={urlFor(item?.src).url() ?? ''}
                  alt={item.alt ?? ''}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                <div className="absolute bottom-2 left-2 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {item.alt}
                </div>
                <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Снимка
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

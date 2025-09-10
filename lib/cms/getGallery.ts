import { sanityFetch } from '@/sanity/lib/live';
import { defineQuery } from 'next-sanity';
import { unstable_cache } from 'next/cache';
import { PaginationParams } from './getMainPageData';
import { Params } from '@/sanity/lib/page/getMainPage';

export const getGallery = unstable_cache(
  async () => {
    const GALLERY_QUERY = defineQuery(`
      *[_type == "albumType" && isPublished == true] | order(_createdAt desc) {
        _id,
        title,
        slug,
        description,
        "coverImage": images[0].asset->url,
        images[]{
          asset-> {
            _ref,
            url
          },
          hotspot
        },
        date,
        "imageCount": count(images)
      }
    `);

    try {
      const result = await sanityFetch({ query: GALLERY_QUERY });
      return result?.data || [];
    } catch (error) {
      console.error('Error fetching albums', error);
      return [];
    }
  },
  ['albums'],
  { tags: ['gallery'], revalidate: 900 },
);

export const getAlbumBySlug = unstable_cache(
  async (slug: string, pagination?: PaginationParams) => {
    const ALBUM_QUERY = defineQuery(`
      *[_type == "albumType" && slug.current == $slug && isPublished == true][0] {
        _id,
        title,
        slug,
        description,
        date,
        "coverImage": images[0].asset->url,
         "totalImages": count(images),
      ${pagination ? `"images": images[$start...$end]` : ' "images": images'} {
        _key,
        asset-> {
          _ref,
          url
        },
        hotspot
      },
      }
    `);

    const params: Params = { slug };
    if (pagination) {
      params.start = pagination.start;
      params.end = pagination.end;
    }

    try {
      const result = await sanityFetch({
        query: ALBUM_QUERY,
        params: params,
      });
      return result?.data || null;
    } catch (error) {
      console.error('Error fetching album', error);
      return null;
    }
  },
  [`album`],
  { tags: ['gallery'], revalidate: 900 },
);

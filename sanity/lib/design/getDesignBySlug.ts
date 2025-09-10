import { defineQuery } from 'next-sanity';
import { sanityFetch } from '../live';
import { unstable_cache } from 'next/cache';
import { PaginationParams } from '@/lib/cms/getMainPageData';
import { Params } from '../page/getMainPage';

export const getDesignBySlug = (
  slug: string,
  pagination?: PaginationParams,
) => {
  return unstable_cache(
    async (slug: string, pagination?: PaginationParams) => {
      const DESIGN_QUERY_BY_SLUG = defineQuery(`
    
    *[ _type == "designType" && slug.current == $slug] | order(_createdAt desc) [0] {

      ...,
      navCards[]->,
      eventVideos[]->{
        _id,
        _type,
        title,
        'videoFile': videoFile.asset->{
          url
        },
        'thumbnail': thumbnail[].asset->{
          url
        },
      }, 
              //images
      "totalImages": count(images),
      ${pagination ? `"images": images[$start...$end]` : ' "images": images'} {
        _key,
        asset-> {
          _ref,
          url
        },
        hotspot
      },
      "messages": undefined
    }
    `);

      const params: Params = { slug };
      if (pagination) {
        params.start = pagination.start;
        params.end = pagination.end;
      }

      try {
        const page = await sanityFetch({
          query: DESIGN_QUERY_BY_SLUG,
          params: params,
        });
        return page.data || null;
      } catch (error) {
        console.error('Error fetching design', error);
        return null;
      }
    },
    [`design-${slug}`],
    {
      tags: ['design'],
      revalidate: 900,
    },
  );
};

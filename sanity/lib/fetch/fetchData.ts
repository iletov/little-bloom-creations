import { defineQuery } from 'next-sanity';
import { sanityFetch } from '../live';
import { unstable_cache } from 'next/cache';

export const getPageData = unstable_cache(
  async (pageId: string) => {
    const PAGE_QUERY = defineQuery(`
       *[_type == "pageType" && pageId == $pageId && status == true][0] {
        sections[] {
          ...,
          backgroundImages[]{
          asset-> {
            _ref,
            url
          },
          hotspot,
          ...
        },
        }
      }
    `);

    try {
      const result = await sanityFetch({
        query: PAGE_QUERY,
        params: { pageId },
      });
      return result?.data || [];
    } catch (error) {
      console.error('Error fetching albums', error);
      return [];
    }
  },
  ['page-data'],
  {
    tags: ['page-data'],
    revalidate: 900,
  },
);

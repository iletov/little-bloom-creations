import { defineQuery } from 'next-sanity';
import { sanityFetch } from '../live';
import { unstable_cache } from 'next/cache';

export const getBannerBySlug = unstable_cache(
  async (slug: string) => {
    const BANNER_BY_TITLE_QUERY = defineQuery(`
    *[_type == "bannerType" && slug.current == $slug][0]
  `);

    try {
      const banner = await sanityFetch({
        query: BANNER_BY_TITLE_QUERY,
        params: { slug },
      });

      return banner.data || [];
    } catch (error) {
      console.error('Error fetching banner', error);
      return [];
    }
  },
  ['banner'],
  {
    tags: ['banner'],
    revalidate: 900,
  },
);

import { sanityFetch } from '@/sanity/lib/live';
import { defineQuery } from 'next-sanity';

import { unstable_cache } from 'next/cache';

export const getCardsData = unstable_cache(
  async (slug: string) => {
    const QUERY = defineQuery(`
    *[_type == "cardsType" && slug.current == $slug][0]{
      ...,
      cards[] {
        ...,
        images {
          ...,
          asset-> {
            _ref,
            url
          }
        },
        subLink[] {
          ...,
          icon-> {
            _ref,
            url
          }
        }

      },

    }
  `);

    try {
      const banner = await sanityFetch({
        query: QUERY,
        params: { slug },
      });

      return banner.data || [];
    } catch (error) {
      console.error('Error fetching cards', error);
      return [];
    }
  },
  ['cards'],
  {
    tags: ['cards'],
    revalidate: 900,
  },
);

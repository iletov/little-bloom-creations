import { defineQuery } from 'next-sanity';
import { sanityFetch } from '../live';
import { unstable_cache } from 'next/cache';

export const getConcertsBySlug = (slug: string) => {
  return unstable_cache(
    async (slug: string) => {
      const CONCERTS_QUERY_BY_SLUG = defineQuery(`
    
    *[ _type == "concertType" && slug.current == $slug] | order(_createdAt desc)[0] 
    `);

      try {
        const concert = await sanityFetch({
          query: CONCERTS_QUERY_BY_SLUG,
          params: { slug },
        });
        return concert.data || null;
      } catch (error) {
        console.error('Error fetching concert', error);
        return null;
      }
    },
    [`concert-${slug}`],
    {
      tags: ['concert', `concert-${slug}`],
      revalidate: 3600,
    },
  );
};

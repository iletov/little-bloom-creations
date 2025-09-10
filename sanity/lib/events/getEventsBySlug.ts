import { defineQuery } from 'next-sanity';
import { sanityFetch } from '../live';
import { unstable_cache } from 'next/cache';

export const getEventsbySlug = (slug: string) => {
  return unstable_cache(
    async (slug: string) => {
      const EVENTS_QUERY_BY_SLUG = defineQuery(`
    
    *[ _type == "eventsType" && slug.current == $slug] | order(_createdAt desc) [0] {

      ...,
      "messages": undefined
    }
    `);

      try {
        const events = await sanityFetch({
          query: EVENTS_QUERY_BY_SLUG,
          params: { slug },
        });
        return events.data || null;
      } catch (error) {
        console.error('Error fetching events', error);
        return null;
      }
    },
    [`events-${slug}`],
    {
      tags: ['events', `events-${slug}`],
      revalidate: 3600,
    },
  );
};

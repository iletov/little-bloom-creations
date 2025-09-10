import { defineQuery } from 'next-sanity';
import { sanityFetch } from '../live';
import { unstable_cache } from 'next/cache';

export const getAllTags = unstable_cache(
  async () => {
    const ALL_TAGS_QUERY = defineQuery(`
    
    *[ _type == "tag"] 
    
    `);

    try {
      const tags = await sanityFetch({ query: ALL_TAGS_QUERY });
      return tags.data || [];
    } catch (error) {
      console.error('Error fetching tags', error);
      return [];
    }
  },
  ['tags'],
  {
    tags: ['tags'],
    revalidate: 900,
  },
);

import { defineQuery } from 'next-sanity';
import { unstable_cache } from 'next/cache';
import { sanityFetch } from '../../sanity/lib/live';

export const getUniqueCategories = unstable_cache(
  async (): Promise<string[]> => {
    const CATEGORIES_QUERY = defineQuery(`
      array::unique(*[_type == "youtubeVideos" && defined(category)].category)
    `);

    try {
      const result = await sanityFetch({
        query: CATEGORIES_QUERY,
      });
      return result?.data || [];
    } catch (error) {
      console.error('Error fetching categories', error);
      return [];
    }
  },
  ['youtube-categories'],
  {
    tags: ['youtube-vids'],
    revalidate: 900,
  },
);

import { defineQuery } from 'next-sanity';
import { sanityFetch } from '../live';
import { unstable_cache } from 'next/cache';

export const getTitleAndDescriptions = unstable_cache(
  async (slug: string) => {
    const TITLE_AND_DESCRIPTIONS_QUERY = defineQuery(`
    
    *[_type == "titleDescriptionType" && slug.current == $slug][0] 
    
    `);

    try {
      const titleAndDescriptions = await sanityFetch({
        query: TITLE_AND_DESCRIPTIONS_QUERY,
        params: { slug },
      });
      return titleAndDescriptions.data || [];
    } catch (error) {
      console.error('Error fetching title and descriptions', error);
      return [];
    }
  },
  ['title-and-descriptions'],
  {
    tags: ['title-and-descriptions'],
    revalidate: 900,
  },
);

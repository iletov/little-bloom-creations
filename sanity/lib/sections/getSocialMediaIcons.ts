import { defineQuery } from 'next-sanity';
import { sanityFetch } from '../live';
import { unstable_cache } from 'next/cache';

export const getSocialMediaIcons = unstable_cache(
  async () => {
    const SOCIAL_MEDIA_QUERY = defineQuery(`
    
    *[ _type == "socialMediaType"]
    `);

    try {
      const icons = await sanityFetch({ query: SOCIAL_MEDIA_QUERY });
      return icons.data || [];
    } catch (error) {
      console.error('Error fetching social media', error);
      return [];
    }
  },
  ['social-media'],
  {
    tags: ['social-media'],
    revalidate: 900,
  },
);

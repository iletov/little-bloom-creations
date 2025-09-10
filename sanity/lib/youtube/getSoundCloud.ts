import { defineQuery } from 'next-sanity';
import { sanityFetch } from '../live';
import { unstable_cache } from 'next/cache';

export const getSoundCloud = unstable_cache(
  async () => {
    const SOUND_CLOUD_QUERY = defineQuery(`
    *[ _type == "soundcloudType"] 
    `);

    try {
      const soundCloud = await sanityFetch({ query: SOUND_CLOUD_QUERY });
      return soundCloud.data || [];
    } catch (error) {
      console.error('Error fetching soundCloud', error);
      return;
    }
  },
  ['soundcloud'],
  {
    tags: ['soundcloud'],
    revalidate: 900,
  },
);

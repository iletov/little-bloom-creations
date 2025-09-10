import { defineQuery } from 'next-sanity';
import { sanityFetch } from '../live';
import { unstable_cache } from 'next/cache';

export const getSectionsControler = unstable_cache(
  async () => {
    const CONTROLLER_QUERY = defineQuery(` 
    *[ _type == "sectionsControler"][0]  
    `);

    try {
      const controllers = await sanityFetch({ query: CONTROLLER_QUERY });
      return controllers.data || [];
    } catch (error) {
      console.error('Error fetching controlers', error);
      return [];
    }
  },
  ['sections-controler'],
  {
    tags: ['sections-controler'],
    revalidate: 900,
  },
);

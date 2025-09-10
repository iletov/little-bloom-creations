import { defineQuery } from 'next-sanity';
import { sanityFetch } from '../live';
import { unstable_cache } from 'next/cache';

export const getSidebarLinks = unstable_cache(
  async () => {
    const LAYOUT_QUERY = defineQuery(`
    
    *[ _type == "sidebarType"] {
      ...,
      socialMedia[]->{
        ...,
        icon{
          asset->{
            url
          }
        }
      }
    }
    `);

    try {
      const links = await sanityFetch({ query: LAYOUT_QUERY });
      return links.data || [];
    } catch (error) {
      console.error('Error fetching sidebar links', error);
      return [];
    }
  },
  ['sidebar'],
  { tags: ['sidebar'], revalidate: 900 },
);

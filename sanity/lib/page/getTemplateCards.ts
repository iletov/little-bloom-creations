import { defineQuery } from 'next-sanity';
import { sanityFetch } from '../live';
import { unstable_cache } from 'next/cache';

export const getTemplateCards = unstable_cache(
  async (type: string | string[]) => {
    const ALL_TEMPLATE_CARDS_QUERY = defineQuery(`
    
    *[ _type == $type] | order(_createdAt desc)
    `);

    try {
      const templateCards = await sanityFetch({
        query: ALL_TEMPLATE_CARDS_QUERY,
        params: { type },
      });
      return templateCards.data || [];
    } catch (error) {
      console.error('Error fetching templates', error);
      return [];
    }
  },
  ['template-cards'],
  {
    tags: ['template-cards'],
    revalidate: 900,
  },
);

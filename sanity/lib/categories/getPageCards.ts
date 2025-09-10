import { defineQuery } from 'next-sanity';
import { sanityFetch } from '../live';

export const getPageCards = async (slug: string) => {
  const PAGE_CARDS_QUERY = defineQuery(`
    *[ _type == "cardsType" && slug.current == $slug][0]`);

  try {
    const pageCards = await sanityFetch({
      query: PAGE_CARDS_QUERY,
      params: { slug },
    });
    return pageCards?.data || [];
  } catch (error) {
    console.error('Error fetching page cards', error);
    return [];
  }
};

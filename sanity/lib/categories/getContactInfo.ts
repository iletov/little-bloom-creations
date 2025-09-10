import { defineQuery } from 'next-sanity';
import { sanityFetch } from '../live';

export const getContactInfo = async (slug: string) => {
  const CONTACT_CARDS_QUERY = defineQuery(`
    *[ _type == "contactInfo" && slug.current == $slug][0]`);

  try {
    const pageCards = await sanityFetch({
      query: CONTACT_CARDS_QUERY,
      params: { slug },
    });
    return pageCards?.data || [];
  } catch (error) {
    console.error('Error fetching page cards', error);
    return [];
  }
};

//DELETE

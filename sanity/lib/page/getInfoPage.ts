import { defineQuery } from 'next-sanity';
import { sanityFetch } from '../live';

export const getInfoPage = async (slug: string) => {
  const INFO_PAGE_QUERY = defineQuery(`
    *[_type == 'infoPageSchema' && slug.current == $slug][0]

  `);

  try {
    const infoPage = await sanityFetch({
      query: INFO_PAGE_QUERY,
      params: { slug },
    });
    return infoPage.data || [];
  } catch (error) {
    console.error('Error fetching infoPage', error);
    return [];
  }
};

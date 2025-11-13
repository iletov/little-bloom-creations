import { defineQuery } from 'next-sanity';
import { sanityFetch } from '../live';
import { unstable_cache } from 'next/cache';

export const getEkontSenderDetails = unstable_cache(
  async () => {
    const EKONT_SENDER_DETAILS_QUERY = defineQuery(`
  *[ _type == "ekontSenderDetails"][0]
  `);

    try {
      const ekontSenderDetails = await sanityFetch({
        query: EKONT_SENDER_DETAILS_QUERY,
      });

      // console.log('EKONT_SENDER_DETAILS_QUERY', ekontSenderDetails?.data);

      return ekontSenderDetails?.data || [];
    } catch (error) {
      console.error('Error fetching ekont sender details', error);
      return [];
    }
  },
  ['ekont-sender-details'],
  {
    tags: ['ekont'],
    revalidate: 60,
  },
);

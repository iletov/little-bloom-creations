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

export const getSpeedySenderDetails = unstable_cache(
  async () => {
    const SPEEDY_SENDER_DETAILS_QUERY = defineQuery(`
  *[ _type == "speedySenderDetails"][0]
  `);

    try {
      const speedySenderDetails = await sanityFetch({
        query: SPEEDY_SENDER_DETAILS_QUERY,
      });

      // console.log('EKONT_SENDER_DETAILS_QUERY', ekontSenderDetails?.data);

      return speedySenderDetails?.data || [];
    } catch (error) {
      console.error('Error fetching ekont sender details', error);
      return [];
    }
  },
  ['speedy-sender-details'],
  {
    tags: ['speedy'],
    revalidate: 60,
  },
);

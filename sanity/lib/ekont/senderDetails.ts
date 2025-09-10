import { defineQuery } from 'next-sanity';
import { sanityFetch } from '../live';

export const getEkontSenderDetails = async () => {
  const EKONT_SENDER_DETAILS_QUERY = defineQuery(`
  *[ _type == "ekontSenderDetails"] 
  `);

  try {
    const ekontSenderDetails = await sanityFetch({
      query: EKONT_SENDER_DETAILS_QUERY,
    });

    // console.log('EKONT_SENDER_DETAILS_QUERY', ekontSenderDetails?.data);

    return ekontSenderDetails.data || [];
  } catch (error) {
    console.error('Error fetching ekont sender details', error);
    return [];
  }
};

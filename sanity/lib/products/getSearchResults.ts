import { defineQuery } from 'next-sanity';
import { sanityFetch } from '../live';

export const getSearchResults = async () => {
  const SEARCH_RESULTS_QUERY = defineQuery(`
    *[_type == "musicStore" || _type == "esotericaStore" || _type == "eventsType" || _type == "concertType" ] | order(Name asc) 
    `);

  try {
    const products: any = await sanityFetch({ query: SEARCH_RESULTS_QUERY });

    return products.data || [];
  } catch (error) {
    console.error('Error fetching products', error);
    return [];
  }
};

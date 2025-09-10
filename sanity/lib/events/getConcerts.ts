import { defineQuery } from 'next-sanity';
import { sanityFetch } from '../live';

export const getConcerts = async () => {
  const CONCERTS_QUERY = defineQuery(`
    
    *[ _type == "concertType"] | order(_createdAt asc) 
    
    `);

  try {
    const concert = await sanityFetch({ query: CONCERTS_QUERY });
    return concert.data || [];
  } catch (error) {
    console.error('Error fetching concerts', error);
    return [];
  }
};

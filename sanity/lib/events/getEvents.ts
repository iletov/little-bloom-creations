import { defineQuery } from 'next-sanity';
import { sanityFetch } from '../live';

export const getEvents = async () => {
  const EVENTS_QUERY = defineQuery(`
    
    *[ _type == "eventsType"] | order(_createdAt asc) 
   { ...,
    "messages": undefined
    }
    `);

  try {
    const events = await sanityFetch({ query: EVENTS_QUERY });
    return events.data || [];
  } catch (error) {
    console.error('Error fetching events', error);
    return [];
  }
};

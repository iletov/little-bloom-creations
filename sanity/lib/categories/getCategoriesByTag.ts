import { defineQuery } from 'next-sanity';
import { sanityFetch } from '../live';

export const getCategoriesByTag = async (tags: string) => {
  const ALL_CATEGORIES_QUERY_BY_TAG = defineQuery(`
    *[_type == "category" && references(*[_type == "tag" && _id == $tags]._id)] | order(Name asc) 
  `);

  try {
    const categories = await sanityFetch({ 
      query: ALL_CATEGORIES_QUERY_BY_TAG,
      params: { tags } // Pass the tag ID as a parameter
    });

    return categories.data || [];
  } catch (error) {
    console.error('Error fetching categories', error);
    return [];
  }
};
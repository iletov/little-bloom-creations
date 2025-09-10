import { defineQuery } from 'next-sanity';
import { sanityFetch } from '../live';

export const getAllProducts = async () => {
  const ALL_PRODUCTS_QUERY = defineQuery(`
    _type in ["musicStore", "esotericaStore"] | order(Name asc) 
    // *[_type == "musicStore" || _type == "esotericaStore" ] | order(Name asc) 
    `);

  try {
    const products: any = await sanityFetch({ query: ALL_PRODUCTS_QUERY });

    return products.data || [];
  } catch (error) {
    console.error('Error fetching products', error);
    return [];
  }
};

//DELETE

import { defineQuery } from 'next-sanity';
import { sanityFetch } from '../live';

export const getFavoriteProducts = async (userId: string) => {
  const FAVORITE_PRODUCTS_QUERY = defineQuery(`
  *[_type == "favoriteProducts" && userId == $userId][0] {
    ...,
    userId,
    itemId[]-> {
      _id,
      Name,
      ...,
    }
  }
    `);

  try {
    const favorites = await sanityFetch({
      query: FAVORITE_PRODUCTS_QUERY,
      params: {
        userId,
      },
    });

    return favorites.data || [];
  } catch (error) {
    console.error('Error fetching favorite products', error);
    return [];
  }
};

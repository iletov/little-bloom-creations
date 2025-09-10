import { defineQuery } from 'next-sanity';
import { sanityFetch } from '../live';

export const searchProductsByName = async (searchParams: string) => {
  const SEARCH_PRODUCTS_BY_NAME_QUERY = defineQuery(`
    *[
      _type in ["musicStore", "esotericaStore", "concertType", "youtubeVideos", 'albumType'] 
      && Name match $searchParams || title match $searchParams || heading match $searchParams || subHeading match $searchParams || location match $searchParams || description match $searchParams
      || pt::text(description) match $searchParams || videoTitle match $searchParams || slug.current match $searchParams
      ] | order(Name asc) 
    `);

  try {
    const data = await sanityFetch({
      query: SEARCH_PRODUCTS_BY_NAME_QUERY,
      params: {
        searchParams: `${searchParams}*`,
      },
    });

    const allItems = data.data;

    // const products = allItems?.filter((product: { _type: string }) =>
    //   ['musicStore', 'esotericaStore'].includes(product._type),
    // );

    const gallery = allItems?.filter((product: { _type: string }) =>
      ['albumType'].includes(product._type),
    );

    const videos = allItems?.filter((product: { _type: string }) =>
      ['youtubeVideos'].includes(product._type),
    );
    const concerts = allItems?.filter((product: { _type: string }) =>
      ['concertType'].includes(product._type),
    );

    return { gallery, videos, concerts };
  } catch (error) {
    console.error('Error while searching products', error);
  }
};

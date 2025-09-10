import { defineQuery } from 'next-sanity';
import { sanityFetch } from '../live';
import { unstable_cache } from 'next/cache';

export const getProductBySlug = (slug: string) => {
  return unstable_cache(
    async (slug: string) => {
      const PRODUCT_BY_SLUG_QUERY = defineQuery(`
  *[
  _type in ["musicStore", "esotericaStore"] && slug.current == $slug
] | order(Name asc) [0] {
  ...,
  category[]->,
  images[]{
    asset->,
    hotspot,
    crop,
    _type,
    _key
  },
  productVideo->{
    _id,
    _type,
    title,
    'videoFile': videoFile.asset->{
      url
    },
    'thumbnail': thumbnail[].asset->{
      url
    },
  }
}   
    `);

      try {
        const product = await sanityFetch({
          query: PRODUCT_BY_SLUG_QUERY,
          params: { slug },
        });

        return product ? product.data : null;
      } catch (error) {
        console.error('Error fetching product', error);
        return null;
      }
    },
    [`product-${slug}`],
    {
      tags: ['product', `product-${slug}`],
      revalidate: 3600,
    },
  );
};

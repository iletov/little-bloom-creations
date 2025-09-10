import { defineQuery } from 'next-sanity';
import { sanityFetch } from '../live';
import { EsotericaStore } from '@/sanity.types';

export const getEsotericaStoreProducts = async () => {
  const ESOTERICA_PRODUCTS_QUERY = defineQuery(`
    *[_type == "esotericaStore"] | order(Name asc) {
      Name,
      stock,
      price,
      discount,
      _id,
      image,
      images[]{
        asset->,
        hotspot,
        crop,
        _type,
        _key
      },
      slug,
      showSizes,
      sizes,
      category[]->{title},
      _type,    
      _createdAt,
      _updatedAt,
      _rev,
      // images[]->,
      // productVideo->,
        
    }
  `);

  try {
    const products = await sanityFetch({
      query: ESOTERICA_PRODUCTS_QUERY,
    });

    return (products.data as unknown as EsotericaStore[]) || [];
  } catch (error) {
    console.error('Error fetching products', error);
    return [];
  }
};

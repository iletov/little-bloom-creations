import { defineQuery } from 'next-sanity';
import { sanityFetch } from '../live';
import { unstable_cache } from 'next/cache';

export const getPageData = unstable_cache(
  async (pageId: string) => {
    const PAGE_QUERY = defineQuery(`
       *[_type == "pageType" && pageId == $pageId && status == true][0] {
        sections[] {
          ...,
          backgroundImages[]{
          asset-> {
            _ref,
            url
          },
          hotspot,
          ...
        },
        }
      }
    `);

    try {
      const result = await sanityFetch({
        query: PAGE_QUERY,
        params: { pageId },
      });
      return result?.data || [];
    } catch (error) {
      console.error('Error fetching albums', error);
      return [];
    }
  },
  ['page-data'],
  {
    tags: ['page-data'],
    revalidate: 900,
  },
);

export const getProductBySlug = unstable_cache(
  async (slug: string) => {
    const PRODUCT_QUERY = defineQuery(`
    *[_type == "productType" && slug.current == $slug][0] {
      ..., 
      name, 
      slug, 
      description, 
      category-> {
        name, 
        slug,
        description,
        image{
          asset-> {
            _ref,
            url
          },
          hotspot,
          ...
        },
        skuPrefix
      },
      price,

      images[]{
        asset-> {
          _ref,
          url
        },
        hotspot,
        ...
      },
      inStock,
      stock,
      sku,
      features[] {
        ...
      },
      metaTitle,
      metaDescription,
      variants[] {
        name,
        price,
        sku,
        compareAtPrice,
        color,
        images[]{
          asset-> {
            _ref,
            url
          },
          hotspot,
          ...
        },
        stock,
        inStock,
        ...
      },
      additionalSections[] {
        ...,
          backgroundImages[]{
          asset-> {
            _ref,
            url
          },
          hotspot,
          ...
        },
      },
      publishedAt,
    }
      `);

    try {
      const res = await sanityFetch({
        query: PRODUCT_QUERY,
        params: { slug },
      });
      return res?.data || [];
    } catch (error) {
      console.error('Error fetching product', error);
      return [];
    }
  },
  ['product'],
  {
    tags: ['product'],
    revalidate: 900,
  },
);

export const getAllCategories = unstable_cache(
  async () => {
    const CATEGORIES_QUERY = defineQuery(`
    *[_type == "category"] {
      ..., 
      name, 
      slug, 
      description, 
      image{ 
        asset-> {
          _ref,
          url
        },
        hotspot,
        ...
      },
      skuPrefix,
    }
      `);

    try {
      const res = await sanityFetch({
        query: CATEGORIES_QUERY,
      });
      return res?.data || [];
    } catch (error) {
      console.error('Error fetching categories', error);
      return [];
    }
  },
  ['categories'],
  {
    tags: ['categories'],
    revalidate: 900,
  },
);

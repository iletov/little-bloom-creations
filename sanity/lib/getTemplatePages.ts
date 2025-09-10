import { defineQuery } from 'next-sanity';
// import { sanityFetch } from './live';
import { client } from './client';

export const getTemplatePages = async (type: string | string[]) => {
  let TEMPLATE_QUERY: string;
  let params: any;

  if (Array.isArray(type)) {
    TEMPLATE_QUERY = defineQuery(`
      *[_type in $types] | order(_createdAt desc) {
        slug,
      }
    `);
    params = { types: type };
  } else {
    TEMPLATE_QUERY = defineQuery(`
      *[_type == $type] | order(_createdAt desc) {
        slug,
      }
    `);
    params = { type };
  }

  try {
    const res = await client.fetch(TEMPLATE_QUERY, params);
    return res || [];
  } catch (error) {
    console.error('Error fetching templates', error);
    return [];
  }
};

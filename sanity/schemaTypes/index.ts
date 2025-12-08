import { type SchemaTypeDefinition } from 'sanity';
import { blockContentType } from './blockContentType';
import { ekontType } from './ekontType';
import { sectionType } from './sectionType';
import { pageType } from './pageType';
import { productType } from './productType';
import { categoryType } from './categoryType';
import { productVariantType } from './productVariantType';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType,
    pageType,
    sectionType,
    productType,
    categoryType,
    productVariantType,
    ekontType,
  ],
};

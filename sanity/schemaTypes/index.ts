import { type SchemaTypeDefinition } from 'sanity';
import { blockContentType } from './blockContentType';
import { ekontType } from './ekontType';
import { sectionType } from './sectionType';
import { pageType } from './pageType';
import { productType } from './productType';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContentType, pageType, sectionType, productType, ekontType],
};

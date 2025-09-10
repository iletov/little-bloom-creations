import { type SchemaTypeDefinition } from 'sanity';
import { blockContentType } from './blockContentType';
import { ekontType } from './ekontType';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContentType, ekontType],
};

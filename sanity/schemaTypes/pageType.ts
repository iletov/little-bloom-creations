import { defineField, defineType } from 'sanity';

export const pageType = defineType({
  name: 'pageType',
  title: 'Page Type',
  type: 'document',
  fields: [
    defineField({
      name: 'status',
      title: 'Published',
      type: 'boolean',
    }),
    defineField({
      name: 'pageId',
      title: 'Page ID',
      type: 'string',
      description:
        'Use: homepage, about, contact, products-listing, product-detail',
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      of: [{ type: 'sectionType' }],
    }),
  ],
});

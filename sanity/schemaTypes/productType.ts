import { defineField, defineType } from 'sanity';

export const productType = defineType({
  name: 'productType',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'status',
      title: 'Published',
      type: 'boolean',
    }),
    defineField({
      name: 'name',
      title: 'Product Name',
      type: 'string',
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' },
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'images',
      title: 'Product Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'inStock',
      title: 'In Stock',
      type: 'boolean',
      initialValue: true,
    }),
    // Optional: Add sections to individual products
    defineField({
      name: 'additionalSections',
      title: 'Additional Sections',
      type: 'array',
      of: [{ type: 'sectionType' }],
      description: 'Optional: Add custom sections for this specific product',
    }),
  ],
});

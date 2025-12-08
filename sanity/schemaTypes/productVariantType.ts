import { defineField, defineType } from 'sanity';

export const productVariantType = defineType({
  name: 'productVariantType',
  title: 'Product Variant',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Variant Name',
      type: 'string',
      description: 'e.g., "Blue", "Pink", "A5 Size", "100 Pages"',
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'sku',
      title: 'SKU',
      type: 'string',
      description: 'Unique identifier for this variant',
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: rule => rule.required().min(0),
    }),
    defineField({
      name: 'compareAtPrice',
      title: 'Compare at Price',
      type: 'number',
      description: 'Original price (for showing discounts)',
      validation: rule => rule.min(0),
    }),
    defineField({
      name: 'color',
      title: 'Color',
      type: 'string',
      options: {
        list: [
          { title: 'Blue', value: 'blue' },
          { title: 'Red', value: 'red' },
          { title: 'Green', value: 'green' },
          { title: 'Yellow', value: 'yellow' },
        ],
      },
    }),

    defineField({
      name: 'images',
      title: 'Variant Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [{ name: 'alt', title: 'Alt Text', type: 'string' }],
        },
      ],
      description: 'Images specific to this variant',
    }),
    defineField({
      name: 'stock',
      title: 'Stock Quantity',
      type: 'number',
      validation: rule => rule.min(0),
      initialValue: 0,
    }),
    defineField({
      name: 'inStock',
      title: 'In Stock',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      name: 'name',
      price: 'price',
      sku: 'sku',
      stock: 'stock',
      image: 'images.0',
    },
    prepare({ name, price, sku, stock, image }) {
      return {
        title: name,
        subtitle: `${price} лв • SKU: ${sku || 'N/A'} • Stock: ${stock || 0}`,
        media: image,
      };
    },
  },
});

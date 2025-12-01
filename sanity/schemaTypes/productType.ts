// sanity/schemaTypes/product.ts
import { defineField, defineType } from 'sanity';

export const productType = defineType({
  name: 'productType',
  title: 'Product',
  type: 'document',
  fields: [
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
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      description: 'Select a category for the product',
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: rule => rule.required().min(0),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'blockContent',
    }),
    defineField({
      name: 'images',
      title: 'Product Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [{ name: 'alt', title: 'Alt Text', type: 'string' }],
        },
      ],
      options: {
        layout: 'grid',
      },
    }),

    //IF VARIANTS
    defineField({
      name: 'hasVariants',
      title: 'Product has variants?',
      type: 'boolean',
      description:
        'Enable this for products with different colors, sizes, etc.',
      initialValue: false,
    }),

    defineField({
      name: 'variants',
      title: 'Product Variants',
      type: 'array',
      of: [{ type: 'productVariantType' }],
      hidden: ({ parent }) => !parent?.hasVariants,
      description: 'Add different variations (colors, sizes, etc.)',
    }),

    // If in stock

    defineField({
      name: 'inStock',
      title: 'In Stock',
      type: 'boolean',
      // hidden: ({ parent }) => parent?.hasVariants,
      initialValue: true,
    }),

    defineField({
      name: 'stock',
      title: 'In stock quantity',
      type: 'number',
      hidden: ({ parent }) => !parent?.inStock,
      // validation: Rule => Rule.min(0),
    }),

    defineField({
      name: 'sku',
      title: 'SKU',
      type: 'string',
      // hidden: ({ parent }) => parent?.hasVariants,
    }),

    // Product details
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [{ type: 'string' }],
    }),

    // SEO fields
    defineField({
      name: 'metaTitle',
      title: 'Meta Title (SEO)',
      type: 'string',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description (SEO)',
      type: 'text',
      rows: 3,
    }),

    // Additional sections
    defineField({
      name: 'additionalSections',
      title: 'Additional Content Sections',
      type: 'array',
      of: [{ type: 'sectionType' }],
      description: 'Add custom sections below product details',
    }),

    defineField({
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      price: 'price',
      image: 'images.0',
      status: 'status',
      inStock: 'inStock',
      hasVariants: 'hasVariants',
      category: 'category.name',
    },
    prepare(selection) {
      const { title, price, image, status, inStock, hasVariants, category } =
        selection;
      const stockStatus = hasVariants
        ? 'Has Variants'
        : inStock
          ? 'In Stock'
          : 'Out of Stock';
      return {
        title: title,
        subtitle: `${price} лв • ${category || 'No category'} • ${stockStatus}`,
        media: image,
      };
    },
  },
});

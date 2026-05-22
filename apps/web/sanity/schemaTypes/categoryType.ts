import { defineField, defineType } from 'sanity';

export const categoryType = defineField({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Category Name',
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
      name: 'description',
      title: 'Description',
      type: 'blockContent',
    }),
    defineField({
      name: 'image',
      title: 'Category Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'skuPrefix',
      title: 'SKU Prefix',
      type: 'string',
      description:
        'Example: DRY for Diaries, GFT for Gift Cards, INV for Invitations',
      validation: rule => rule.max(3).uppercase(),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'skuPrefix',
      media: 'image',
    },
  },
});

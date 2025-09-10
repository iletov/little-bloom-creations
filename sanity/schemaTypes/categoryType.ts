import { TagIcon } from '@sanity/icons';
import { Bookmark } from 'lucide-react';
import { defineField, defineType } from 'sanity';

export const categoryType = defineType({
  name: 'category',
  title: 'Категории',
  type: 'document',
  icon: Bookmark as any,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'type',
      title: 'Тип',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'tag' } }],
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title',
      },
    }),
    defineField({
      name: 'description',
      type: 'text',
    }),
  ],

  // preview
  preview: {
    select: {
      title: 'title',
      description: 'description',
    },
  },
});

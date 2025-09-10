import { TagIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export const tagType = defineType({
  name: 'tag',
  title: 'Продуктови тагове',
  type: 'document',
  icon: TagIcon as any,
  fields: [
    defineField({
      name: 'title',
      title: 'Име на таг-а',
      type: 'string',
    }),
  ],

  //preview
  preview: {
    select: {
      title: 'title',
    },
  },
});

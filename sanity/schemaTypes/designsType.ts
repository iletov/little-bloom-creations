import { defineField, defineType } from 'sanity';
import { HomeIcon } from '@sanity/icons';

export const designsType = defineType({
  name: 'design',
  title: 'Дизайни',
  type: 'document',
  icon: HomeIcon as any,
  fields: [
    defineField({
      name: 'title',
      title: 'Design Name',
      type: 'string',
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),

    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),

    defineField({
      name: 'presentation',
      title: 'Presentation',
      type: 'blockContent',
    }),

    defineField({
      name: 'thumbnail',
      title: 'Thumbnail',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),

    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
    }),
  ],
});

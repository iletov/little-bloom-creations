import { defineField, defineType } from 'sanity';

// schemas/album.js
export const albumType = defineType({
  name: 'albumType',
  title: 'Album',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Заглавие на албума',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Описание на албума',
      type: 'text',
    }),

    defineField({
      name: 'images',
      title: 'Снимки',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
      options: {
        layout: 'grid',
      },
    }),
    defineField({
      name: 'date',
      title: 'Album Date',
      type: 'date',
    }),
    defineField({
      name: 'isPublished',
      title: 'Published',
      type: 'boolean',
      initialValue: false,
    }),
  ],

  preview: {
    select: {
      title: 'title',
      images: 'images',
      description: 'description',
    },
    prepare(selection) {
      const { title, images, description } = selection;

      return {
        title: title || 'Untitled Album',
        media: images && images.length > 0 ? images[0] : null,
        subtitle: description || `${images?.length || 0} снимки`,
      };
    },
  },
});

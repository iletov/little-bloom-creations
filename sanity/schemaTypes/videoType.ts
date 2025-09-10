import { HomeIcon } from '@sanity/icons';
import { Play } from 'lucide-react';
import { defineField, defineType } from 'sanity';

export const videoType = defineType({
  name: 'video',
  title: 'Видео',
  type: 'document',
  icon: Play as any,
  fields: [
    defineField({
      name: 'title',
      title: 'Заглавие на видеото',
      type: 'string',
    }),

    defineField({
      name: 'url',
      title: 'Видео URL',
      type: 'url',
    }),

    defineField({
      name: 'thumbnail',
      title: 'Снимка за видео',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
        },
      ],
    }),

    defineField({
      name: 'videoFile',
      title: 'Видео файл',
      type: 'file',
      options: {
        accept: 'video/*',
      },
    }),
  ],

  //preview
  preview: {
    select: {
      title: 'title',
      // media: 'thumbnail',
    },
    prepare(selection) {
      return {
        title: selection.title,
        // media: selection.media.length > 0 ? selection.media[0] : null,
      };
    },
  },
});

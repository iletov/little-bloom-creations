import { Link } from 'lucide-react';
import { defineField, defineType } from 'sanity';

export const youtubeVideosType = defineType({
  name: 'youtubeVideos',
  title: 'Youtube',
  type: 'document',
  icon: Link as any,
  fields: [
    defineField({
      name: 'category',
      title: 'Категория',
      type: 'string',
      options: {
        list: [
          { title: 'Музика', value: 'music' },
          { title: 'Без граници', value: 'bez-granitsi' },
          { title: 'Пътят към себе си', value: 'putyat-kum-sebe-si' },
        ],
      },
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: 'videoTitle',
      title: 'Заглавие на видеото',
      type: 'string',
    }),

    defineField({
      name: 'url',
      title: 'Видео URL',
      type: 'url',
    }),
  ],

  preview: {
    select: {
      title: 'videoTitle',
    },
    prepare(selection) {
      const { title } = selection;
      return { title };
    },
  },
});

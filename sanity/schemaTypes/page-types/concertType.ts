import { Mic } from 'lucide-react';
import { defineField, defineType } from 'sanity';

export const concertType = defineType({
  name: 'concertType',
  title: 'Концерти - темплейт',
  type: 'document',
  icon: Mic as any,
  fields: [
    defineField({
      name: 'title',
      title: 'Наименование на концерта',
      type: 'string',
    }),
    defineField({
      name: 'heading',
      title: 'Заглавие',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
      },
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: 'buyTicketLink',
      title: 'Линк за купуване на билети',
      type: 'url',
    }),

    defineField({
      name: 'available',
      title: 'Достъпнен за закупуване',
      type: 'boolean',
      initialValue: true,
      description:
        'Дали е достъпен за закупуване билет. Управлява се от бутона. По подразбиране е достъпен.',
    }),
    defineField({
      name: 'icon',
      title: 'Икона',
      type: 'image',
      options: {
        hotspot: true,
      },
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
    }),

    defineField({
      name: 'eventVideos',
      title: 'Видео за концерта',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'video' } }],
    }),
    defineField({
      name: 'date',
      title: 'Дата',
      type: 'datetime',
      options: {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm',
        timeStep: 15,
      },
    }),
    defineField({
      name: 'subHeading',
      title: 'Подзаглавие',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Описание',
      type: 'text',
    }),
    defineField({
      name: 'location',
      title: 'Локация',
      type: 'string',
    }),
  ],

  preview: {
    select: {
      title: 'title',
      media: 'images',
      icon: 'icon',
    },
    prepare(select) {
      return {
        title: select.title,
        media: select.media[0] || select.icon,
      };
    },
  },
});

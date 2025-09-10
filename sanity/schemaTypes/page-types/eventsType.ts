import { EyeIcon } from 'lucide-react';
import { defineField, defineType } from 'sanity';

export const eventsType = defineType({
  name: 'eventsType',
  title: 'Събития - темплейт',
  type: 'document',
  icon: EyeIcon as any,
  fields: [
    defineField({
      name: 'title',
      title: 'Наименование на събитието',
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
      name: 'available',
      title: 'Достъпност до събитието',
      type: 'boolean',
      initialValue: true,
      description: 'Определя дали събитието е достъпно или не',
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
      title: 'Видео на събитието',
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

    defineField({
      name: 'contactFormHeading',
      title: 'Заглавие на контактна форма',
      type: 'string',
    }),

    defineField({
      name: 'messages',
      title: 'Съобщения/Запитвания',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'message',
          fields: [
            {
              name: 'name',
              title: 'Име',
              type: 'string',
            },
            {
              name: 'email',
              title: 'Имейл',
              type: 'string',
            },
            {
              name: 'phone',
              title: 'Телефон',
              type: 'string',
            },
            {
              name: 'message',
              title: 'Съобщение',
              type: 'text',
            },
            {
              name: 'createdAt',
              title: 'Изпратено на дата:',
              type: 'datetime',
              // readOnly: true,
            },
          ],
          preview: {
            select: {
              title: 'name',
              subtitle: 'email',
              date: 'createdAt',
            },
            prepare({ title, subtitle, date }) {
              return {
                title,
                subtitle: `${subtitle} - ${new Date(date).toLocaleString()}`,
              };
            },
          },
        },
      ],
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

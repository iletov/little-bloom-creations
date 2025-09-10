import { InfoIcon } from 'lucide-react';
import { defineArrayMember, defineField, defineType } from 'sanity';

export const contactInfoType = defineType({
  name: 'contactInfo',
  title: 'Контактна информация',
  type: 'document',
  icon: InfoIcon as any,
  fields: [
    defineField({
      name: 'title',
      title: 'Наименование на контактната информация',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
    }),
    defineField({
      name: 'heading',
      title: 'Заглавие',
      type: 'string',
    }),
    defineField({
      name: 'contacts',
      title: 'Контакти',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Заглавие',
              type: 'string',
            }),
            defineField({
              name: 'phone',
              title: 'Телефон',
              type: 'string',
            }),
            defineField({
              name: 'email',
              title: 'Имейл',
              type: 'string',
            }),
            defineField({
              name: 'other',
              title: 'Друго',
              type: 'string',
            }),
          ],
          preview: {
            select: {
              title: 'title',
            },
            prepare(selection) {
              return {
                title: selection.title,
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
    },
    prepare(selection) {
      return {
        title: selection.title,
      };
    },
  },
});

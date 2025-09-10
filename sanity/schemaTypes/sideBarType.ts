import { EllipsisVertical } from 'lucide-react';
import { defineField, defineType } from 'sanity';

export const sidebarType = defineType({
  name: 'sidebarType',
  title: 'Меню - навигация',
  type: 'document',
  icon: EllipsisVertical as any,
  fields: [
    defineField({
      name: 'title',
      title: 'Име на секция',
      type: 'string',
      description: 'За коя секция се отнася заглавието',
    }),
    defineField({
      name: 'header',
      title: 'Заглавие',
      type: 'string',
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      // options: {
      //   source: 'Header',
      // },
      // validation: Rule => Rule.required(),
    }),

    defineField({
      name: 'links',
      title: 'Линкове за навигация към страниците',
      type: 'array',
      of: [
        {
          type: 'object',
          title: 'Линк',
          fields: [
            defineField({
              name: 'title',
              title: 'Име на страницата',
              type: 'string',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'slug',
              title: 'slug',
              type: 'slug',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'icon',
              title: 'Икона',
              type: 'image',
              options: {
                hotspot: true,
              },
              // validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'subLinks',
              title: 'Под-линкове',
              type: 'array',
              of: [
                {
                  type: 'object',
                  title: 'линк',
                  fields: [
                    defineField({
                      name: 'title',
                      title: 'Име на страницата',
                      type: 'string',
                      validation: Rule => Rule.required(),
                    }),
                    defineField({
                      name: 'slug',
                      title: 'slug',
                      type: 'slug',
                      validation: Rule => Rule.required(),
                    }),
                  ],
                },
              ],
            }),
          ],
        },
      ],
    }),
  ],

  preview: {
    select: {
      title: 'title',
    },
    prepare(select) {
      return {
        title: select.title,
      };
    },
  },
});

import { FrameIcon } from 'lucide-react';
import { defineField, defineType } from 'sanity';

export const bannerType = defineType({
  name: 'bannerType',
  title: 'Банери',
  type: 'document',
  icon: FrameIcon as any,
  fields: [
    defineField({
      name: 'title',
      title: 'Име на банера',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'slug',
      type: 'slug',
    }),
    defineField({
      name: 'heading',
      title: 'Заглавие',
      type: 'string',
    }),
    defineField({
      name: 'subHeading',
      title: 'Подзаглавие',
      type: 'blockContent',
    }),
    defineField({
      name: 'bannerImageMobile',
      title: 'Снимка за мобилно',
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
      name: 'bannerImage',
      title: 'Снимка за десктоп',
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
      name: 'bannerTitle',
      title: 'Заглавие върху банера',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Описание върху банера, под заглавието',
      type: 'blockContent',
    }),
  ],

  preview: {
    select: {
      title: 'title',
      media: 'bannerImage',
    },

    prepare(select) {
      return {
        title: select.title,
        media: select?.media[0],
      };
    },
  },
});

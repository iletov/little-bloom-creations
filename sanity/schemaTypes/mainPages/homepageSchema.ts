import { HomeIcon } from 'lucide-react';
import { defineField, defineType } from 'sanity';

export const homepageSchema = defineType({
  name: 'homepageSchema',
  title: 'Начални страници',
  type: 'document',
  icon: HomeIcon as any,
  fields: [
    defineField({
      name: 'title',
      title: 'Име на страницата',
      type: 'string',
      description: 'Име на страницата. Не се използва в сайта.',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description:
        'Това поле не трябва да се променя. То създава url адреса на страницата',
    }),

    defineField({
      name: 'banner',
      title: 'Банер',
      type: 'reference',
      to: [{ type: 'bannerType' }],
      description:
        'Банера може да се използва само в главните страници. Темплейт страниците се генерират автоматично и използват банер от собствената си секция.',
      hidden: ({ parent }) => {
        const slug = parent?.slug?.current;
        return slug === 'template' || slug === 'template-design';
      },
    }),

    defineField({
      name: 'navCards',
      title: 'Карти (навигация)',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [
            {
              type: 'cardsType',
            },
          ],
        },
      ],
      hidden: ({ parent }) => {
        const slug = parent?.slug?.current;
        return slug !== '/';
      },
    }),

    //  Title and Description

    {
      name: 'titleDescriptionSection',
      title: 'Секция - Заглавие и описание',
      type: 'object',
      fields: [
        {
          name: 'heading',
          title: 'Заглавие',
          type: 'string',
          description: 'Optional heading that appears above the title',
          validation: Rule => Rule.max(80),
        },
        defineField({
          name: 'description',
          title: 'Описание',
          type: 'blockContent',
        }),
      ],
      options: {
        collapsible: true,
        collapsed: false,
      },
    },

    // EVENTS

    // defineField({
    //   name: 'switchEvents',
    //   title: 'Събития (без граници) - показване/скриване',
    //   type: 'boolean',
    //   initialValue: false,
    // }),

    // defineField({
    //   name: 'eventsHeading',
    //   title: 'Заглавие - предстоящи събития (без граници)',
    //   type: 'reference',
    //   to: [{ type: 'headingType' }],
    //   hidden: ({ parent }) => !parent?.switchEvents,
    // }),

    // defineField({
    //   name: 'upcommingEvents',
    //   title: 'Предстоящи събития',
    //   type: 'array',
    //   of: [
    //     {
    //       type: 'reference',
    //       to: [
    //         {
    //           type: 'eventsType',
    //         },
    //       ],
    //     },
    //   ],
    //   hidden: ({ parent }) => !parent?.switchEvents,
    // }),

    // // CONCERTS

    // defineField({
    //   name: 'switchConcerts',
    //   title: 'Концерти- показване/скриване',
    //   type: 'boolean',
    //   initialValue: false,
    // }),

    // defineField({
    //   name: 'concertsHeading',
    //   title: 'Заглавие - предстоящи концерти',
    //   type: 'reference',
    //   to: [{ type: 'headingType' }],
    //   hidden: ({ parent }) => !parent?.switchConcerts,
    // }),

    // defineField({
    //   name: 'upcommingConcerts',
    //   title: 'Предстоящи концерти',
    //   type: 'array',
    //   of: [
    //     {
    //       type: 'reference',
    //       to: [
    //         {
    //           type: 'concertType',
    //         },
    //       ],
    //     },
    //   ],
    //   hidden: ({ parent }) => !parent?.switchConcerts,
    // }),

    // MULTISECTION

    defineField({
      name: 'multiSection',
      title: 'За нас',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [
            {
              type: 'multiSectionType',
            },
          ],
        },
      ],
      hidden: ({ parent }) => {
        const slug = parent?.slug?.current;

        return slug !== 'about-us';
      },
    }),

    // MUSIC PRODUCTS

    // defineField({
    //   name: 'switchMusicProducts',
    //   title: 'Музикален магазин- включване/изключване',
    //   type: 'boolean',
    //   initialValue: false,
    // }),

    // defineField({
    //   name: 'musicProductsHeading',
    //   title: 'Заглавие - продукти за музика',
    //   type: 'reference',
    //   to: [{ type: 'headingType' }],
    //   hidden: ({ parent }) => !parent?.switchMusicProducts,
    // }),

    // defineField({
    //   name: 'musicProducts',
    //   title: 'Продукти (Музика)',
    //   type: 'array',
    //   of: [
    //     {
    //       type: 'reference',
    //       to: [
    //         {
    //           type: 'musicStore',
    //         },
    //       ],
    //     },
    //   ],
    //   hidden: ({ parent }) => !parent?.switchMusicProducts,
    // }),

    // ESOTERICA PRODUCTS

    // defineField({
    //   name: 'switchEsotericaProducts',
    //   title: 'Без граници магазин- включване/изключване',
    //   type: 'boolean',
    //   initialValue: false,
    // }),

    // defineField({
    //   name: 'esotericaProductsHeading',
    //   title: 'Заглавие - продукти за без граници',
    //   type: 'reference',
    //   to: [{ type: 'headingType' }],
    //   hidden: ({ parent }) => !parent?.switchEsotericaProducts,
    // }),

    // defineField({
    //   name: 'esotericaProducts',
    //   title: 'Продукти (Без граници)',
    //   type: 'array',
    //   of: [
    //     {
    //       type: 'reference',
    //       to: [
    //         {
    //           type: 'esotericaStore',
    //         },
    //       ],
    //     },
    //   ],
    //   hidden: ({ parent }) => !parent?.switchEsotericaProducts,
    // }),

    // IMAGES

    // // EVENT VIDEOS
    // defineField({
    //   name: 'eventVideos',
    //   title: 'Видео',
    //   type: 'array',
    //   of: [{ type: 'reference', to: { type: 'video' } }],
    //   hidden: ({ parent }) => {
    //     const slug = parent?.slug?.current;
    //     return slug !== 'music-store' && slug !== 'bez-granitsi';
    //   },
    // }),

    defineField({
      name: 'switchContactForm',
      title: 'Контактна форма',
      type: 'boolean',
      initialValue: false,
    }),

    defineField({
      name: 'contactInfo',
      title: 'Информация - контактна форма',
      type: 'reference',
      to: [{ type: 'contactInfo' }],
      hidden: ({ parent }) => !parent?.switchContactForm,
    }),
  ],
});

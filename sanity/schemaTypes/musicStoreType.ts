// import { ShoppingCartIcon } from "@/Components/icons/icons;
import { ShoppingCartIcon } from '@/component/icons/icons';
import { Music } from 'lucide-react';
import { defineField, defineType } from 'sanity';

export const musicStoreType = defineType({
  name: 'musicStore',
  title: 'Музикален магазин',
  type: 'document',
  // icon: ShoppingCartIcon as any,
  icon: Music as any,
  fields: [
    defineField({
      name: 'Name',
      title: 'Име на продукт',
      type: 'string',
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: 'type',
      title: 'Тип на продукта',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'tag' } }],
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'Name',
        maxLength: 96,
      },
    }),
    // defineField({
    //   name: 'image',
    //   title: 'Image',
    //   type: 'image',
    //   options: {
    //     hotspot: true,
    //   },
    // }),
    defineField({
      name: 'images',
      title: 'Снимки',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
        },
      ],
    }),

    defineField({
      name: 'productVideo',
      title: 'Видео за продукта',
      type: 'reference',
      to: { type: 'video' },
    }),

    defineField({
      name: 'description',
      title: 'Описание',
      type: 'blockContent',
      // validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Цена',
      type: 'number',
      validation: Rule => Rule.required().min(0),
    }),

    defineField({
      name: 'discount',
      title: 'Отстъпка- (процент %)',
      type: 'number',
      validation: Rule => Rule.min(0),
    }),

    defineField({
      name: 'category',
      title: 'Категория',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'category' } }],
    }),
    defineField({
      name: 'stock',
      title: 'Наличност',
      type: 'number',
      validation: Rule => Rule.min(0),
    }),
    defineField({
      name: 'showSizes',
      title: 'Покажи размери',
      type: 'boolean',
      initialValue: false,
      description: 'Показва размерите на продукта, ако е необходимо',
    }),
    defineField({
      name: 'sizes',
      title: 'Налични размери',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], // choices
      },
      hidden: ({ parent }) => !parent?.showSizes,
    }),
  ],

  // preview
  preview: {
    select: {
      title: 'Name',
      media: 'images',
      priceP: 'price',
    },
    prepare(select) {
      // const {title, media, subtitle} = select
      return {
        title: select.title,
        media: select.media[0],
        subtitle: `${select.priceP}лв.`,
      };
    },
  },
});

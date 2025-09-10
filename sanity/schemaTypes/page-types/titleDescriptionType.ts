import { PencilIcon } from 'lucide-react';
import { defineField, defineType } from 'sanity';

export const titleDescriptionType = defineType({
  name: 'titleDescriptionType',
  title: 'Секция заглавие и описание',
  type: 'document',
  icon: PencilIcon as any,
  fields: [
    defineField({
      name: 'title',
      title: 'Наименивание на секцията',
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
    }),
    defineField({
      name: 'description',
      title: 'Описание',
      type: 'blockContent',
    }),
    defineField({
      name: 'floatingImage',
      title: 'Снимка за бекграунд',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
      description:
        'Тази картинка е предназначена да се слива с фона на страницата.',
    }),
  ],
});

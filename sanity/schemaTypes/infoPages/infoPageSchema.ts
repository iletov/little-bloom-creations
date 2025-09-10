import { InfoIcon } from 'lucide-react';
import { defineField, defineType } from 'sanity';

export const infoPageSchema = defineType({
  name: 'infoPageSchema',
  title: 'Информационни страници',
  type: 'document',
  icon: InfoIcon as any,
  fields: [
    defineField({
      name: 'title',
      title: 'Име на страницата',
      type: 'string',
      description: 'Име на страницата. Не се използва в сайта.',
    }),
    defineField({
      name: 'heading',
      title: 'Заглавие',
      type: 'string',
      description: 'Заглавието, което ще се показва на секцията',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description:
        'Това поле не трябва да се променя. То създава url адреса на страницата',
    }),
    defineField({
      name: 'content',
      title: 'Съдържание',
      type: 'blockContent',
      description: 'Съдържанието на страницата.',
    }),
  ],
});

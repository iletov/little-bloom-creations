import { defineField, defineType } from 'sanity';

export const multiSectionType = defineType({
  name: 'multiSectionType',
  title: 'Секция заглавие, описание и снимки',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Име на секцията',
      type: 'string',
      description: 'Заглавие на секцията (не се показва на сайта)',
    }),
    defineField({
      name: 'heading',
      title: 'Заглавие',
      type: 'string',
      description: 'Заглавието, което ще се показва на секцията',
    }),
    defineField({
      name: 'description',
      title: 'Съдържание, описание',
      type: 'blockContent',
      description: 'Съдържанието, което ще се показва на секцията',
      // rows: 4,
    }),
    defineField({
      name: 'image',
      title: 'Снимка',
      type: 'image',
      description: 'Снимката, която ще се показва на секцията',
      options: {
        hotspot: true,
        metadata: ['blurhash', 'lqip', 'palette'],
      },
    }),
  ],
  preview: {
    select: {
      title: 'heading',
    },
    prepare({ title }) {
      return {
        title: title || 'Untitled Section',
      };
    },
  },
  orderings: [
    {
      title: 'Heading A-Z',
      name: 'headingAsc',
      by: [{ field: 'heading', direction: 'asc' }],
    },
    {
      title: 'Created Date (Newest)',
      name: 'createdDesc',
      by: [{ field: '_createdAt', direction: 'desc' }],
    },
  ],
});

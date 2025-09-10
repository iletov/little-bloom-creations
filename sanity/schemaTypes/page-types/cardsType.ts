import { FileText } from 'lucide-react';
import { defineField, defineType } from 'sanity';

// Single unified schema for a section with cards directly embedded
export const cardsType = defineType({
  name: 'cardsType',
  title: 'Секция с карти - навигация',
  type: 'document',
  icon: FileText as any,
  fields: [
    // Section heading
    defineField({
      name: 'sectionTitle',
      title: 'Заглавие на секцията',
      type: 'string',
      validation: Rule => Rule.required(),
      description: 'Основното заглавие за тази секция',
    }),

    // Section slug
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'sectionTitle',
        maxLength: 96,
      },
    }),

    // Section subheading
    defineField({
      name: 'sectionSubheading',
      title: 'Подзаглавие на секцията',
      type: 'text',
      description: 'Кратко описание на секцията',
    }),

    // Cards directly embedded in the section
    defineField({
      name: 'cards',
      title: 'Карти',
      type: 'array',
      of: [
        {
          type: 'object',
          title: 'Карта',
          fields: [
            // Card title
            defineField({
              name: 'title',
              title: 'Име на карта',
              type: 'string',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'heading',
              title: 'Заглавие на карта',
              type: 'string',
              validation: Rule => Rule.required(),
            }),

            // Card slug
            defineField({
              name: 'slug',
              title: 'Slug',
              type: 'slug',
              options: {
                source: 'title',
                maxLength: 96,
              },
            }),

            // Card description
            defineField({
              name: 'description',
              title: 'Описание',
              type: 'blockContent',
            }),

            // Card images
            defineField({
              name: 'images',
              title: 'Снимки',
              type: 'image',
              options: { hotspot: true },
            }),
          ],
          preview: {
            select: {
              title: 'title',
              media: 'images',
            },
            prepare(selection) {
              const { title, media } = selection;
              return {
                title,
                media: media && media[0],
              };
            },
          },
        },
      ],
    }),
  ],

  preview: {
    select: {
      title: 'sectionTitle',
      subtitle: 'sectionSubheading',
      cards: 'cards',
    },
    prepare(selection) {
      const { title, subtitle, cards } = selection;
      const cardCount = cards?.length || 0;
      return {
        title,
        subtitle: `${subtitle ? subtitle + ' | ' : ''}${cardCount} card${cardCount !== 1 ? 's' : ''}`,
      };
    },
  },
});

// Export the schema
export default cardsType;

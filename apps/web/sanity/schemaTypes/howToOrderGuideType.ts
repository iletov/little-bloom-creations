import { defineField, defineType } from 'sanity';

export const howToOrderGuideType = defineType({
  name: 'howToOrderGuide',
  title: 'How to Order Guide',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Guide Title',
      type: 'string',
      description: 'e.g., Guide for Blankets, Guide for Diaries',
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'steps',
      title: 'Order Steps',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Step Title',
              type: 'string',
              validation: rule => rule.required(),
            }),
            defineField({
              name: 'content',
              title: 'Step Content',
              type: 'blockContent',
            }),
          ],
        },
      ],
    }),
  ],
});

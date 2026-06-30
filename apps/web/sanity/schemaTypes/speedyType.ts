import { Link } from 'lucide-react';
import { defineField, defineType } from 'sanity';

export const speedyType = defineType({
  name: 'speedySenderDetails',
  title: 'Спиди',
  type: 'document',
  icon: Link as any,
  fields: [
    defineField({
      name: 'title',
      title: 'Услуга на Спиди',
      type: 'string',
    }),
    defineField({
      name: 'sender',
      title: 'Sender',
      description: 'sender object',
      type: 'object',
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
        {
          name: 'clientId',
          title: 'Client ID',
          type: 'string',
        },
        {
          name: 'phone',
          title: 'Телефон',
          type: 'string',
          validation: Rule => Rule.required(),
        },
        {
          name: 'contactName',
          title: 'Контактно име',
          type: 'string',
          validation: Rule => Rule.required(),
        },
        {
          name: 'email',
          title: 'Имейл',
          type: 'string',
        },
      ],
    }),
  ],
});

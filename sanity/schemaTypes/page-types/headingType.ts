import { Heading } from 'lucide-react';
import { defineField, defineType } from 'sanity';

export const headingType = defineType({
  name: 'headingType',
  title: 'Секция заглавие',
  type: 'document',
  icon: Heading as any,
  fields: [
    defineField({
      name: 'title',
      title: 'Име на секция',
      type: 'string',
      description: 'За коя секция се отнася заглавието',
    }),
    defineField({
      name: 'heading',
      title: 'Заглавие на секция',
      type: 'string',
      description: 'Заглавието, което ще се показва на секцията',
    }),
  ],

  preview: {
    select: {
      title: 'heading',
      subtitle: 'title',
    },
    prepare(select) {
      return {
        title: select.title,
        subtitle: select.subtitle,
      };
    },
  },
});

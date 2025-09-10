import { Music2 } from 'lucide-react';
import { defineField, defineType } from 'sanity';

export const soundcloudType = defineType({
  name: 'soundcloudType',
  title: 'Soundcloud',
  type: 'document',
  icon: Music2 as any,
  fields: [
    defineField({
      name: 'title',
      title: 'Заглавие на песента',
      type: 'string',
    }),
    defineField({
      name: 'trackId',
      title: 'ID на песента',
      type: 'string',
      placeholder: 'Необходимо да се въведено ID на песента на Soundcloud',
    }),
  ],
});

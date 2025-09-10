import { Globe } from 'lucide-react';
import { defineField, defineType } from 'sanity';

export const socialMediaType = defineType({
  name: 'socialMediaType',
  title: 'Социална мрежа - икони',
  type: 'document',
  icon: Globe as any,
  fields: [
    defineField({
      name: 'title',
      title: 'Име на социалната мрежа',
      type: 'string',
    }),
    defineField({
      name: 'url',
      title: 'URL на социалната мрежа',
      type: 'url',
    }),
    defineField({
      name: 'icon',
      title: 'Икона',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
  ],
});

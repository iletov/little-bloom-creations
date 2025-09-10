import { EnvelopeIcon } from '@sanity/icons';
import { ShoppingBag } from 'lucide-react';
import { defineField, defineType } from 'sanity';

export const contactFormType = defineType({
  name: 'contactForm',
  title: 'Контактна форма',
  type: 'document',
  icon: EnvelopeIcon as any,
  fields: [
    defineField({
      name: 'userId',
      title: 'Потребитеклско ID',
      type: 'string',
    }),
    defineField({
      name: 'registeredName',
      title: 'Име, с което е регистриран потребител',
      type: 'string',
    }),
    defineField({
      name: 'registeredEmail',
      title: 'Имейл, с който е регистриран потребител',
      type: 'string',
    }),
    defineField({
      name: 'firstName',
      title: 'Име',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'lastName',
      title: 'Фамилия',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Имейл',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'phoneNumber',
      title: 'Телефонен номер',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'message',
      title: 'Съобщение',
      type: 'text',
      validation: Rule => Rule.required(),
    }),
  ],

  //previes
  preview: {
    select: {
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'email',
      phoneNumber: 'phoneNumber',
    },
    prepare(select) {
      return {
        title: `${select.firstName} ${select.lastName}`,
        subtitle: `${select.email} | ${select.phoneNumber}`,
        media: EnvelopeIcon as any,
      };
    },
  },
});

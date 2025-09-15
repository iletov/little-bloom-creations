import { defineField, defineType } from 'sanity';

export const sectionType = defineType({
  name: 'sectionType',
  title: 'Section',
  type: 'object',
  fields: [
    defineField({
      name: 'sectionType',
      title: 'Section Type',
      type: 'string',
      options: {
        list: [
          { title: 'Slide Banner', value: 'slideBanner' },
          { title: 'Hero Banner', value: 'hero' },
          { title: 'Heading + Description', value: 'headingDescription' },
          { title: 'Call to Action', value: 'cta' },
          { title: 'Text Block', value: 'textBlock' },
          { title: 'Image Gallery', value: 'imageGallery' },
          { title: 'Full Background', value: 'fullBackground' },
          { title: 'Contact Form', value: 'contactForm' },
        ],
      },
      validation: rule => rule.required(),
    }),

    // ---- Hero and Slide Banner fields ----
    // Title
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      hidden: ({ parent }) => !parent?.sectionType,
    }),
    // Description
    defineField({
      name: 'description',
      title: 'Description',
      type: 'blockContent',
      hidden: ({ parent }) => !parent?.sectionType,
    }),
    // Phrase
    defineField({
      name: 'phrase',
      title: 'Phrase',
      type: 'string',

      hidden: ({ parent }) =>
        !['headingDescription'].includes(parent?.sectionType) ||
        !parent?.sectionType,
    }),

    // ---- Image fields ----

    //backgroundImage
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      hidden: ({ parent }) =>
        ['slideBanner'].includes(parent?.sectionType) || !parent?.sectionType,
    }),

    //Mobile Image
    defineField({
      name: 'mobileImage',
      title: 'Mobile Image',
      type: 'image',
      hidden: ({ parent }) =>
        ['slideBanner'].includes(parent?.sectionType) || !parent?.sectionType,
    }),

    // backgroundImages
    defineField({
      name: 'backgroundImages',
      title: 'Background Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true, // Allows cropping/focal point selection
          },
          fields: [
            {
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              description: 'Important for SEO and accessibility',
            },
            {
              name: 'caption',
              title: 'Caption',
              type: 'string',
              description: 'Optional caption for the image',
            },
          ],
        },
      ],
      hidden: ({ parent }) =>
        !['slideBanner', 'imageGallery', 'fullBackground'].includes(
          parent?.sectionType,
        ) || !parent?.sectionType,
      options: {
        layout: 'grid',
      },
      validation: rule =>
        rule
          .max(6)
          .warning('Consider using fewer images for better performance'),
    }),

    // ---- Heading + Description fields ----

    //---- List fields ----

    // List Items
    defineField({
      name: 'listItems',
      title: 'List Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'description', title: 'Description', type: 'string' },
            {
              name: 'image',
              title: 'Image',
              type: 'image',
            },
          ],
        },
      ],
      hidden: ({ parent }) => !['textBlock'].includes(parent?.sectionType),
    }),

    // CTA Button
    defineField({
      name: 'button',
      title: 'Button',
      type: 'object',
      fields: [
        { name: 'text', title: 'Button Text', type: 'string' },
        { name: 'url', title: 'Button URL', type: 'string' },
      ],
      hidden: ({ parent }) => !parent?.sectionType,
    }),
  ],

  preview: {
    select: {
      type: 'sectionType',
      title: 'title',
      heading: 'heading',
    },
    prepare({ type, title, heading }) {
      const displayTitle = title || heading || 'Untitled';
      return {
        title: displayTitle,
        subtitle: `${type} section`,
      };
    },
  },
});

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
          { title: 'Testimonials', value: 'testimonials' },
          { title: 'Image Gallery', value: 'imageGallery' },
          { title: 'Full Background', value: 'fullBackground' },
          { title: 'Category Card', value: 'categoryCard' },
          { title: 'Contact Form', value: 'contactForm' },
          { title: 'Newsletter', value: 'newsletter' },
          { title: 'Multisection', value: 'multisection' },
          { title: 'Product Preview', value: 'productPreview' },
          { title: 'Tab Section', value: 'tabSection' },
          { title: 'Trust strip / Предимства', value: 'benefits' },
        ],
      },
      validation: rule => rule.required(),
    }),

    //Background collor
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      initialValue: 'pink',
      options: {
        list: [
          { title: 'Pink', value: 'pink' },
          { title: 'Green', value: 'green' },
        ],
      },
      hidden: ({ parent }) =>
        !['newsletter', 'productPreview'].includes(parent?.sectionType) ||
        !parent?.sectionType,
    }),

    // Position
    defineField({
      name: 'position',
      title: 'Position',
      type: 'string',
      initialValue: 'left',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Right', value: 'right' },
        ],
        layout: 'radio',
      },
      hidden: ({ parent }) =>
        !parent?.sectionType ||
        !['productPreview'].includes(parent?.sectionType),
    }),

    // Banner Size
    defineField({
      name: 'size',
      title: 'Size',
      type: 'string',
      initialValue: 'large',
      options: {
        list: [
          { title: 'Small', value: 'small' },
          { title: 'Large', value: 'large' },
        ],
        layout: 'radio',
      },
      hidden: ({ parent }) =>
        !parent?.sectionType || !['hero'].includes(parent?.sectionType),
    }),

    // ---- Hero and Slide Banner fields ----

    // Title
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'object',
      hidden: ({ parent }) => !parent?.sectionType,
      fields: [
        {
          name: 'title',
          title: 'Full Title',
          type: 'string',
          description:
            'Enter the complete heading, including the text that will be highlighted.',
          validation: Rule => Rule.required(),
        },
        {
          name: 'highlightedWord',
          title: 'Text to Highlight',
          type: 'string',
          description:
            'Enter the exact text from Full Title that should use the accent color.',
          validation: Rule =>
            Rule.custom((value, context) => {
              if (value === undefined) {
                return true;
              }

              if (typeof value !== 'string') {
                return 'The highlighted text must be a string.';
              }

              const parent = context.parent;

              if (
                typeof parent !== 'object' ||
                parent === null ||
                !('title' in parent) ||
                typeof parent.title !== 'string'
              ) {
                return 'Full Title is required before highlighted text can be set.';
              }

              return parent.title.includes(value)
                ? true
                : 'The highlighted text must appear exactly in Full Title.';
            }),
        },
        {
          name: 'highlightedColor',
          title: 'Highlight Color',
          type: 'string',
          initialValue: 'var(--pink-1)',
          options: {
            list: [
              { title: 'Pink-1', value: 'var(--pink-1)' },
              { title: 'Green-1', value: 'var(--green-1)' },
              { title: 'Pink-5', value: 'var(--pink-5)' },
              { title: 'Green-5', value: 'var(--green-5)' },
              { title: 'Pink-9', value: 'var(--pink-9)' },
              { title: 'Green-9', value: 'var(--green-9)' },
              { title: 'Dark Green', value: 'var(--green-dark)' },
              { title: 'Dark Pink', value: 'var(--pink-dark)' },
            ],
          },
        },
      ],
      preview: {
        select: {
          title: 'title',
        },
        prepare({ title }) {
          return {
            title: title,
          };
        },
      },
    }),

    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      description: 'Short label displayed above the heading.',
      hidden: ({ parent }) => parent?.sectionType !== 'headingDescription',
      validation: rule => rule.max(80),
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
        ![
          'hero',
          'headingDescription',
          'cta',
          'imageGallery',
          'fullBackground',
          'contactForm',
          'newsletter',
        ].includes(parent?.sectionType) || !parent?.sectionType,
    }),

    //Mobile Image
    defineField({
      name: 'mobileImage',
      title: 'Mobile Image',
      type: 'image',
      hidden: ({ parent }) =>
        ![
          'hero',
          'headingDescription',
          'cta',
          'imageGallery',
          'fullBackground',
          'contactForm',
          'newsletter',
        ].includes(parent?.sectionType) || !parent?.sectionType,
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
              name: 'title',
              title: 'title',
              type: 'string',
            },
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
            {
              name: 'slug',
              title: 'URL',
              type: 'slug',
            },
          ],
        },
      ],
      hidden: ({ parent }) =>
        ![
          'slideBanner',
          'imageGallery',
          'categoryCard',
          'productPreview',
        ].includes(parent?.sectionType) || !parent?.sectionType,
      options: {
        layout: 'grid',
      },
      validation: rule =>
        rule
          .max(6)
          .warning('Consider using fewer images for better performance'),
    }),

    // products
    defineField({
      name: 'products',
      title: 'Products (References)',
      description: 'Select products from the catalog to display in this section. If configured, these products will be used instead of manual Background Images.',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'productType' }],
        },
      ],
      hidden: ({ parent }) =>
        parent?.sectionType !== 'slideBanner' || !parent?.sectionType,
      validation: rule =>
        rule.max(6).warning('We recommend showing at most 6 products for optimal layout'),
    }),

    defineField({
      name: 'categories',
      title: 'Categories (References)',
      description: 'Select categories from the catalog to display in this section. If configured, these categories will be used instead of manual Background Images.',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'category' }],
        },
      ],
      hidden: ({ parent }) =>
        parent?.sectionType !== 'categoryCard' || !parent?.sectionType,
      validation: rule =>
        rule.max(6).warning('We recommend showing at most 6 categories for optimal layout'),
    }),

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
            { name: 'subTitle', title: 'Sub Title', type: 'string' },
            { name: 'description', title: 'Description', type: 'blockContent' },
            {
              name: 'image',
              title: 'Image',
              type: 'image',
            },
            {
              name: 'button',
              title: 'Button',
              type: 'object',
              fields: [
                { name: 'text', title: 'Button Text', type: 'string' },
                { name: 'slug', title: 'Button URL', type: 'slug' },
              ],
            },
          ],
        },
      ],
      hidden: ({ parent }) =>
        !['testimonials', 'multisection', 'tabSection'].includes(
          parent?.sectionType,
        ),
    }),

    defineField({
      name: 'benefitItems',
      title: 'Предимства',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'benefitItem',
          title: 'Предимство',
          fields: [
            defineField({
              name: 'icon',
              title: 'Икона',
              type: 'string',
              options: {
                list: [
                  { title: 'Ръчна изработка', value: 'handmade' },
                  { title: 'Персонализация', value: 'personalization' },
                  { title: 'Сигурно плащане', value: 'securePayment' },
                  { title: 'Доставка', value: 'delivery' },
                ],
                layout: 'dropdown',
              },
              validation: rule => rule.required(),
            }),
            defineField({
              name: 'title',
              title: 'Заглавие',
              type: 'string',
              validation: rule => rule.required().max(60),
            }),
            defineField({
              name: 'description',
              title: 'Описание',
              type: 'text',
              rows: 2,
              validation: rule => rule.required().max(160),
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'description',
            },
          },
        },
      ],
      hidden: ({ parent }) => parent?.sectionType !== 'benefits',
      validation: rule =>
        rule.min(2).max(4).error('Добавете между 2 и 4 предимства.'),
    }),

    defineField({
      name: 'benefitEyebrow',
      title: 'Benefits Eyebrow',
      type: 'string',
      hidden: ({ parent }) => parent?.sectionType !== 'benefits',
      validation: rule => rule.max(80),
    }),

    defineField({
      name: 'benefitHeading',
      title: 'Benefits Heading',
      type: 'string',
      hidden: ({ parent }) => parent?.sectionType !== 'benefits',
      validation: rule => rule.max(120),
    }),

    defineField({
      name: 'benefitDescription',
      title: 'Benefits Description',
      type: 'text',
      rows: 3,
      hidden: ({ parent }) => parent?.sectionType !== 'benefits',
      validation: rule => rule.max(240),
    }),

    // CTA Button
    defineField({
      name: 'button',
      title: 'Button',
      type: 'object',
      fields: [
        { name: 'text', title: 'Button Text', type: 'string' },
        { name: 'slug', title: 'Button URL', type: 'slug' },
      ],
      hidden: ({ parent }) =>
        ![
          'productPreview',
          'newsletter',
          'contactForm',
          'categoryCard',
          'fullBackground',
          'imageGallery',
          'slideBanner',
          'hero',
          'headingDescription',
          'cta',
        ].includes(parent?.sectionType) || !parent?.sectionType,
    }),
  ],

  preview: {
    select: {
      type: 'sectionType',
      title: 'heading.title',
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

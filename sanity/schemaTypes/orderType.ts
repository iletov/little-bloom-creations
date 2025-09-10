// import { ShoppingCartIcon } from "@/Components/icons/icons;
import { ShoppingCartIcon } from '@/component/icons/icons';
import { defineArrayMember, defineField, defineType } from 'sanity';

export const orderType = defineType({
  name: 'order',
  title: 'Поръчки',
  type: 'document',
  icon: ShoppingCartIcon as any,
  fields: [
    defineField({
      name: 'orderNumber',
      title: 'Номер на поръчката',
      type: 'string',
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: 'stripeCheckoutSessionId',
      title: 'Stripe Checkout Session ID',
      type: 'string',
      description:
        'Id номер от страйп за създаване на поръчка (генериран автоматично)',
    }),

    defineField({
      name: 'stripeCustomerId',
      title: 'Страйп - потребоителски ID',
      type: 'string',
      description: 'Клиенстки ID номер от страйп (генериран автоматично)',
    }),
    defineField({
      name: 'clerkUserId',
      title: 'Clerk - потребоителски ID',
      type: 'string',
      description: 'Клиенстки ID номер от clerk (генериран автоматично)',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'customerDetails',
      title: 'Данни на потребителя',
      type: 'object',
      fields: [
        {
          name: 'customerName',
          title: 'Име',
          type: 'string',
          validation: Rule => Rule.required(),
        },
        {
          name: 'customerEmail',
          title: 'Имейл',
          type: 'string',
          validation: Rule => Rule.required(),
        },

        {
          name: 'customerPhone',
          title: 'Телефонен номер',
          type: 'string',
        },
      ],
    }),

    defineField({
      name: 'customerAddress',
      title: 'Адрес за доставка',
      type: 'object',
      fields: [
        {
          name: 'country',
          title: 'Държава',
          type: 'string',
          description: 'Държавата за момента е по подразбиране',
        },
        {
          name: 'city',
          title: 'Град',
          type: 'string',
        },
        {
          name: 'officeCode',
          title: 'Офис код',
          type: 'string',
        },
        {
          name: 'zip',
          title: 'Пощенски код',
          type: 'string',
        },
        {
          name: 'street',
          title: 'Улица',
          type: 'string',
        },
        {
          name: 'streetNumber',
          title: 'Номер на улицата',
          type: 'string',
        },
        {
          name: 'other',
          title: 'друго',
          type: 'string',
        },
      ],
    }),

    defineField({
      name: 'stripePaymentIntentId',
      title: 'Stripe Payment Intent ID',
      type: 'string',
      description: 'Need this for stripe',
    }),

    // custom

    defineField({
      name: 'products',
      title: 'Продукти',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'product',
              title: 'Закупени продукти',
              type: 'reference',
              to: [{ type: 'musicStore' }, { type: 'esotericaStore' }],
            }),

            defineField({
              name: 'quantity',
              title: 'Количество',
              type: 'number',
            }),
            defineField({
              name: 'selectedSize',
              title: 'Размер',
              type: 'string',
            }),
          ],

          preview: {
            select: {
              product: 'product.Name',
              quantity: 'quantity',
              image: 'product.image',
              price: 'product.price',
              currency: 'product.currency',
            },
            prepare(select) {
              return {
                title: `${select.product} x ${select.quantity}`,
                price: `${select.price * select.currency}`,
                media: select.image,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'totalPrice',
      title: 'Общо цена',
      type: 'number',
      validation: Rule => Rule.required().min(0),
    }),
    defineField({
      name: 'currency',
      title: 'Валута',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    // defineField({
    //   name: 'amountDiscount',
    //   title: 'Amount Discount',
    //   type: 'number',
    //   validation: Rule => Rule.min(0),
    // }),
    defineField({
      name: 'deliveryMethod',
      title: 'Метод за доставка',
      type: 'string',
      description: 'The delivery method of the order - Delivery or Office',
    }),
    defineField({
      name: 'paymentMethod',
      title: 'Метод за плащане',
      type: 'string',
      description: 'Избраният начин за плащане - Cash (брой) или Card (карта)',
    }),
    defineField({
      name: 'status',
      title: 'Статус на поръчката',
      type: 'string',
      options: {
        list: [
          { title: 'Изчакване', value: 'pending' },
          // { title: 'Paid', value: 'paid' },
          // { title: 'Cash', value: 'cash' },
          { title: 'Обработване - в брой', value: 'inProgress' },
          { title: 'Готова - с карта', value: 'ready' },
          { title: 'Неуспешно', value: 'failed' },
          { title: 'Отказана', value: 'canceled' },
          { title: 'Възстановяване', value: 'refunded' },
          { title: 'Изпратена', value: 'send' },
        ],
        layout: 'dropdown',
      },
    }),
    defineField({
      name: 'wasLabelPatched',
      title: 'Was Label Patched',
      type: 'boolean',
      initialValue: false,
      hidden: true,
    }),

    defineField({
      name: 'labelURL',
      title: 'Товарителница - Линк',
      type: 'url',
      description: 'The label URL of the order',
    }),
    defineField({
      name: 'labelAsset',
      title: 'Товарителница - Документ',
      type: 'file',
      description:
        'Документ за товарителница от поръчката, може да бъде PDF, PNG или JPG.',
      options: {
        accept: '.pdf,.png,.jpg', // Restrict to specific file types if needed
      },
    }),
    defineField({
      name: 'orderDate',
      title: 'Дата на поръчката',
      type: 'datetime',
      validation: Rule => Rule.required(),
    }),
  ],

  // preview

  preview: {
    select: {
      customerName: 'customerDetails.customerName',
      amount: 'totalPrice',
      currency: 'currency',
      orderId: 'orderNumber',
      email: 'customerDetails.customerEmail',
      status: 'status',
    },
    prepare(select) {
      const orderIdSnipper = `${select.orderId.slice(0, 5)}...${select.orderId.slice(-5)}`;
      return {
        title: `${select.customerName} | ${select.email} (${orderIdSnipper})`,
        subtitle: `${select.status} | ${select.amount} ${select.currency}`,
        media: ShoppingCartIcon,
      };
    },
  },
});

import { Link } from 'lucide-react';
import { defineField, defineType } from 'sanity';

export const ekontType = defineType({
  name: 'ekontSenderDetails',
  title: 'Еконт',
  type: 'document',
  icon: Link as any,
  fields: [
    defineField({
      name: 'title',
      title: 'Услуга на Еконт',
      type: 'string',
    }),
    defineField({
      name: 'senderClient',
      title: 'Sender Client',
      type: 'object',
      fields: [
        {
          name: 'name',
          title: 'Име на подателя - (Фирма)',
          type: 'string',
          validation: Rule => Rule.required(),
        },
        {
          name: 'phones',
          title: 'Телефонни номера',
          type: 'array',
          of: [{ type: 'string' }],
          validation: Rule => Rule.required(),
        },
        {
          name: 'email',
          title: 'Имейл',
          type: 'string',
        },
        {
          name: 'juridicalEntity',
          title: 'juridical Entity',
          type: 'number',
          description: '0 - физично лице, 1 - юридично лице',
        },
        {
          name: 'ein',
          title: 'БУЛСТАТ',
          type: 'string',
          description: '123456789',
        },
        {
          name: 'ddsEinPrefix',
          title: 'DDS Префикс на БУЛСТАТ',
          type: 'string',
          initialValue: 'BG',
        },
        {
          name: 'ddsEin',
          title: 'DDS БУЛСТАТ',
          type: 'string',
          description: 'BG123456789',
        },
        {
          name: 'molName',
          title: 'Име на МОЛ',
          type: 'string',
        },
        {
          name: 'molEGN',
          title: 'ЕГН на МОЛ',
          type: 'string',
        },
      ],
    }),

    defineField({
      name: 'senderAddress',
      title: 'Адрес на подателя',
      type: 'object',
      fields: [
        {
          name: 'city',
          title: 'Град',
          type: 'string',
        },
        {
          name: 'postCode',
          title: 'Пощенски код',
          type: 'string',
        },
        {
          name: 'street',
          title: 'Улица',
          type: 'string',
        },
        {
          name: 'num',
          title: 'Номер на улицата',
          type: 'string',
        },
        {
          name: 'other',
          title: 'Други',
          type: 'string',
        },
      ],
    }),
    defineField({
      name: 'senderDeliveryType',
      title: 'Тип на доставката',
      type: 'string',
      options: {
        list: [
          { title: 'Office', value: 'office' },
          { title: 'Delivery', value: 'delivery' },
        ],
      },
      initialValue: 'office',
      validation: Rule => Rule.required(),
      description:
        'Какъв да е типа на доставката - от офис или чрез заявка за куриер. Към момента е възможно изпращане от офис.',
    }),
    defineField({
      name: 'senderOfficeCode',
      title: 'Код на офис, от който се изпраща',
      type: 'string',
      initialValue: '5803',
      description: 'Офис Сан Стефано - 5803',
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: 'cdPayOptionsVariants',
      title: 'Варианти за опции за наложен платеж',
      type: 'boolean',
      description: 'Ръчно добавяне на опции за наложен платеж',
      initialValue: false,
    }),

    defineField({
      name: 'cdPayOptionsTemplate',
      title: 'Шаблон за опции за наложен платеж',
      type: 'string',
      description: 'попълва се номер на споразуменито за наложен платеж',
      hidden: ({ parent }) => parent?.cdPayOptionsVariants,
    }),
    defineField({
      name: 'cdOptions',
      title: 'Опции за наложен платеж',
      type: 'object',
      fields: [
        {
          name: 'method',
          title: 'Метод на наложен платеж',
          type: 'string',
          options: {
            list: [
              { title: 'Bank', value: 'bank' },
              // { title: 'Delivery', value: 'delivery' },
            ],
          },
          validation: Rule => Rule.required(),
        },
        {
          name: 'bic',
          title: 'BIC Код',
          type: 'string',
          validation: Rule => Rule.required(),
        },
        {
          name: 'iban',
          title: 'IBAN',
          type: 'string',
          validation: Rule => Rule.required(),
        },
        {
          name: 'bankCurrency',
          title: 'Валута на банка',
          type: 'string',
          options: {
            list: [
              { title: 'EUR', value: 'EUR' },
              { title: 'BGN', value: 'BGN' },
            ],
          },
          validation: Rule => Rule.required(),
        },
        {
          name: 'payDays',
          title: 'Дни за плащане',
          type: 'number',
          placeholder: '1',
          validation: Rule => Rule.required(),
        },
      ],
      hidden: ({ parent }) => !parent?.cdPayOptionsVariants,
    }),

    defineField({
      name: 'payAfterAccept',
      title: 'Опция "Плати след приемане"',
      type: 'string',
      options: {
        list: [
          { title: 'Да', value: '1' },
          { title: 'Не', value: '0' },
        ],
      },
    }),
    defineField({
      name: 'payAfterTest',
      title: 'Опция "Плати след тест"',
      type: 'string',
      options: {
        list: [
          { title: 'Да', value: '1' },
          { title: 'Не', value: '0' },
        ],
      },
    }),
    defineField({
      name: 'shipmentDescription',
      title: 'Описание на доставката',
      type: 'string',
    }),
    defineField({
      name: 'paymentSenderMethod',
      title: 'Метод на плащане на подателя',
      type: 'string',
      options: {
        list: [
          { title: 'Cash', value: 'cash' },
          { title: 'Credit', value: 'credit' },
        ],
      },
    }),
    defineField({
      name: 'paymentSenderAmount',
      title: 'Сума за плащане от подателя',
      type: 'string',
    }),
    defineField({
      name: 'paymentReceiverMethod',
      title: 'Метод на плащане на получателя',
      type: 'string',
      options: {
        list: [{ title: 'Cash', value: 'cash' }],
      },
    }),
    defineField({
      name: 'paymentReceiverAmount',
      title: 'сума за плащане от получателя',
      type: 'string',
      // initialValue: '5.99',
    }),
    // defineField({
    //   name: 'paymentReceiverAmountIsPercent',
    //   title: 'Payment Receiver Amount %',
    //   type: 'number',
    //   placeholder: ''
    // }),
    defineField({
      name: 'returnInstructionParams',
      title: 'Инструкции за връщане',
      type: 'object',
      fields: [
        {
          name: 'type',
          title: 'Тип',
          type: 'string',
          options: {
            list: [{ title: 'Връщане', value: 'return' }],
          },
        },
        {
          name: 'returnParcelDestination',
          title: 'До къде да се достави, в случай на връщане',
          type: 'string',
          placeholder: 'Офис, до подател, адрес или оставете празно',
          options: {
            list: [
              { title: '', value: '' },
              { title: 'Office', value: 'office' },
              { title: 'Sender', value: 'sender' },
              { title: 'Address', value: 'address' },
            ],
          },
        },
        {
          name: 'returnParcelPaymentSide',
          title: 'Кой ще поеме разноските по връщането',
          type: 'string',
          options: {
            list: [
              { title: 'Подател', value: 'sender' },
              { title: 'Получател', value: 'receiver' },
            ],
          },
          initialValue: 'sender',
        },
        {
          name: 'returnParcelReceiverOfficeCode',
          title: 'Офис код, до когото ще се върне доставката',
          type: 'string',
        },
      ],
    }),
  ],
});

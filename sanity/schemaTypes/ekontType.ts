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
      title: 'Данни на подателя',
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
      validation: Rule => Rule.required(),
      description:
        'Какъв да е типа на доставката - от офис или чрез заявка за куриер. Към момента е възможно изпращане от офис.',
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
          placeholder: '3',
          validation: Rule => Rule.required(),
        },
      ],
    }),
    defineField({
      name: 'senderOfficeCode',
      title: 'Код на офис, от който се изпраща',
      type: 'string',
      validation: Rule => Rule.required(),
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
      initialValue: '5.99',
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
            list: [{ title: 'Връшане', value: 'return' }],
          },
        },
        {
          name: 'returnParcelDestination',
          title: 'До къде да се достави, в случай на връщане',
          type: 'string',
          placeholder: 'Офис, до подател, адрес или оставете празно',
          // options: {
          //   list: [
          //     { title: '', value: '' },
          //     { title: 'Office', value: 'office' },
          //     { title: 'Sender', value: 'sender' },
          //     { title: 'Address', value: 'address' },
          //   ],
          // },
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

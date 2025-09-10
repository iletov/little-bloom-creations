import { Metadata } from '@/app/api/payment-intent/route';
import prisma from '@/lib/prismaClient';

export interface UserCheckoutProps {
  metadata: Metadata;
  amount: number;
  orderDetails: {
    country: string;
    city: string;
    postalCode: string;
    phoneNumber: string;
    officeCode?: string;
    street?: string;
    streetNumber?: string;
    other?: string;
  };
  orderMethods: {
    paymentMethod: string;
    deliveryMethod: string;
  };
}

export const userCheckout = async (info: UserCheckoutProps) => {
  const { metadata, amount, orderDetails, orderMethods } = info;

  await prisma.userCheckout.create({
    data: {
      orderNumber: metadata.orderNumber,
      name: metadata.customerName,
      phones: [orderDetails.phoneNumber],
      city: orderDetails.city,
      postCode: orderDetails.postalCode,
      street: orderDetails.street || '',
      streetNumber: orderDetails.streetNumber || '',
      other: orderDetails.other || '',
      receiverOfficeCode: orderDetails.officeCode || '',
      receiverDeliveryType:
        orderMethods.deliveryMethod === 'ekont-office' ? 'office' : 'delivery',
      paymentMethod: orderMethods.paymentMethod,
      cdAmount: amount / 100,
    },
  });
};

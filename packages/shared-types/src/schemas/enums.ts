import { z } from 'zod';

export enum DeliveryMethodEnum {
  SPEEDY_OFFICE = 'speedy-office',
  SPEEDY_DELIVERY = 'speedy-delivery',
  EKONT_OFFICE = 'ekont-office',
  EKONT_DELIVERY = 'ekont-delivery',
}

export enum PaymentMethodEnum {
  CASH = 'cash',
  STRIPE = 'stripe',
}

export const OrderStatusSchema = z.enum(['pending', 'confirmed', 'shipped', 'refunded', 'cancelled']);
export const PaymentMethodSchema = z.nativeEnum(PaymentMethodEnum);
export const DeliveryMethodSchema = z.nativeEnum(DeliveryMethodEnum);

export type OrderStatus = z.infer<typeof OrderStatusSchema>;
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;
export type DeliveryMethod = z.infer<typeof DeliveryMethodSchema>;

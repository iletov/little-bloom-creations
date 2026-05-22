import { z } from 'zod';

export const OrderStatusSchema = z.enum(['pending', 'confirmed', 'shipped', 'refunded', 'cancelled']);
export const PaymentMethodSchema = z.enum(['bank', 'cash']);
export const DeliveryMethodSchema = z.enum(['ekont-office', 'speedy-delivery', 'speedy-office']);

export type OrderStatus = z.infer<typeof OrderStatusSchema>;
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;
export type DeliveryMethod = z.infer<typeof DeliveryMethodSchema>;

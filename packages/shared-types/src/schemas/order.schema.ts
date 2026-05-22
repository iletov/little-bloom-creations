import { z } from 'zod';
import { OrderStatusSchema, PaymentMethodSchema, DeliveryMethodSchema } from './enums';

export const OrderShippingSchema = z.object({
  id: z.string().uuid().optional(),
  full_name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(5),
  country: z.string().min(2),
  city: z.string().min(2),
  postal_code: z.string().min(2),
  street: z.string().optional(),
  street_number: z.string().optional(),
  block_no: z.string().optional(),
  entrance_no: z.string().optional(),
  floor_no: z.string().optional(),
  apartment_no: z.string().optional(),
  office_code: z.string().optional(),
  additional_info: z.string().optional(),
});

export const OrderItemSchema = z.object({
  id: z.string().uuid().optional(),
  product_id: z.string().uuid(),
  variant_id: z.string().uuid().nullable().optional(),
  name: z.string(),
  variant_name: z.string().nullable().optional(),
  quantity: z.number().int().positive(),
  unit_price: z.number().positive(),
  subtotal: z.number().positive(),
  weight: z.number().positive(),
  personalization: z.record(z.any()).optional(), // Can be refined later
});

export const OrderSchema = z.object({
  id: z.string().uuid().optional(),
  order_number: z.string(),
  status: OrderStatusSchema,
  total_amount: z.number().positive(),
  subtotal: z.number().positive(),
  delivery_cost: z.number().nonnegative(),
  delivery_method: DeliveryMethodSchema,
  payment_method: PaymentMethodSchema,
  shipment_number: z.string().nullable().optional(),
  shipping_details: OrderShippingSchema,
  items: z.array(OrderItemSchema).min(1),
});

export type Order = z.infer<typeof OrderSchema>;
export type OrderShipping = z.infer<typeof OrderShippingSchema>;
export type OrderItem = z.infer<typeof OrderItemSchema>;

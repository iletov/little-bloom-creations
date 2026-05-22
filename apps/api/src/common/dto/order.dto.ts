import { createZodDto } from 'nestjs-zod';
import { OrderSchema, OrderItemSchema, OrderShippingSchema } from '@repo/shared-types';

export class OrderDto extends createZodDto(OrderSchema) {}
export class OrderItemDto extends createZodDto(OrderItemSchema) {}
export class OrderShippingDto extends createZodDto(OrderShippingSchema) {}

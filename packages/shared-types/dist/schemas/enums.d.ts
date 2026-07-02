import { z } from 'zod';
export declare enum DeliveryMethodEnum {
    SPEEDY_OFFICE = "speedy-office",
    SPEEDY_DELIVERY = "speedy-delivery",
    EKONT_OFFICE = "ekont-office",
    EKONT_DELIVERY = "ekont-delivery"
}
export declare enum PaymentMethodEnum {
    CASH = "cash",
    STRIPE = "stripe"
}
export declare const OrderStatusSchema: z.ZodEnum<["pending", "confirmed", "failed", "shipped", "delivered", "refunded", "cancelled"]>;
export declare const PaymentMethodSchema: z.ZodNativeEnum<typeof PaymentMethodEnum>;
export declare const DeliveryMethodSchema: z.ZodNativeEnum<typeof DeliveryMethodEnum>;
export type OrderStatus = z.infer<typeof OrderStatusSchema>;
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;
export type DeliveryMethod = z.infer<typeof DeliveryMethodSchema>;

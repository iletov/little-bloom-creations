"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaceCashOrderSchema = exports.PlaceCashOrderItemSchema = exports.OrderSchema = exports.OrderItemSchema = exports.OrderShippingSchema = void 0;
const zod_1 = require("zod");
const enums_1 = require("./enums");
exports.OrderShippingSchema = zod_1.z.object({
    id: zod_1.z.string().uuid().optional(),
    full_name: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    phone: zod_1.z.string().min(5),
    country: zod_1.z.string().min(2),
    city: zod_1.z.string().min(2),
    postal_code: zod_1.z.string().min(2),
    street: zod_1.z.string().optional(),
    street_number: zod_1.z.string().optional(),
    block_no: zod_1.z.string().optional(),
    entrance_no: zod_1.z.string().optional(),
    floor_no: zod_1.z.string().optional(),
    apartment_no: zod_1.z.string().optional(),
    office_code: zod_1.z.string().optional(),
    additional_info: zod_1.z.string().optional(),
});
exports.OrderItemSchema = zod_1.z.object({
    id: zod_1.z.string().uuid().optional(),
    product_id: zod_1.z.string().uuid(),
    variant_id: zod_1.z.string().uuid().nullable().optional(),
    name: zod_1.z.string(),
    variant_name: zod_1.z.string().nullable().optional(),
    quantity: zod_1.z.number().int().positive(),
    unit_price: zod_1.z.number().positive(),
    subtotal: zod_1.z.number().positive(),
    weight: zod_1.z.number().positive(),
    personalization: zod_1.z.record(zod_1.z.any()).optional(),
});
exports.OrderSchema = zod_1.z.object({
    id: zod_1.z.string().uuid().optional(),
    order_number: zod_1.z.string(),
    status: enums_1.OrderStatusSchema,
    total_amount: zod_1.z.number().positive(),
    subtotal: zod_1.z.number().positive(),
    delivery_cost: zod_1.z.number().nonnegative(),
    delivery_method: enums_1.DeliveryMethodSchema,
    payment_method: enums_1.PaymentMethodSchema,
    shipment_number: zod_1.z.string().nullable().optional(),
    shipping_details: exports.OrderShippingSchema,
    items: zod_1.z.array(exports.OrderItemSchema).min(1),
});
exports.PlaceCashOrderItemSchema = zod_1.z.object({
    productId: zod_1.z.string().uuid(),
    variantId: zod_1.z.string().uuid().nullable().optional(),
    sku: zod_1.z.string(),
    variantSku: zod_1.z.string().nullable().optional(),
    name: zod_1.z.string(),
    variantName: zod_1.z.string().nullable().optional(),
    quantity: zod_1.z.number().int().positive(),
    unitPrice: zod_1.z.number().positive(),
    weight: zod_1.z.number().positive(),
    personalization: zod_1.z.record(zod_1.z.any()).optional(),
});
exports.PlaceCashOrderSchema = zod_1.z.object({
    deliveryMethod: enums_1.DeliveryMethodSchema,
    shippingDetails: exports.OrderShippingSchema,
    items: zod_1.z.array(exports.PlaceCashOrderItemSchema).min(1),
    totalAmount: zod_1.z.number().positive(),
    deliveryCost: zod_1.z.number().nonnegative(),
    totalWeight: zod_1.z.number().positive(),
    shipmentDescription: zod_1.z.string().optional(),
});

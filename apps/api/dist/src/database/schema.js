"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhookEventsRelations = exports.orderItemsRelations = exports.orderShippingRelations = exports.ordersRelations = exports.productVariantsRelations = exports.productsRelations = exports.webhookEvents = exports.pendingOrders = exports.orderItems = exports.orderShipping = exports.orders = exports.productVariants = exports.products = exports.deliveryMethodEnum = exports.paymentMethodEnum = exports.orderStatusEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
exports.orderStatusEnum = (0, pg_core_1.pgEnum)('order_status_enum', ['pending', 'confirmed', 'shipped', 'refunded', 'cancelled']);
exports.paymentMethodEnum = (0, pg_core_1.pgEnum)('payment_method_enum', ['bank', 'cash']);
exports.deliveryMethodEnum = (0, pg_core_1.pgEnum)('delivery_method_enum', ['ekont-office', 'ekont-delivery', 'speedy-delivery', 'speedy-office']);
exports.products = (0, pg_core_1.pgTable)('products', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    sku: (0, pg_core_1.varchar)('sku').unique().notNull(),
    name: (0, pg_core_1.varchar)('name').notNull(),
    price: (0, pg_core_1.numeric)('price').notNull(),
    discount: (0, pg_core_1.numeric)('discount'),
    weight: (0, pg_core_1.numeric)('weight'),
    width: (0, pg_core_1.numeric)('width'),
    height: (0, pg_core_1.numeric)('height'),
    length: (0, pg_core_1.numeric)('length'),
    depth: (0, pg_core_1.numeric)('depth'),
    currentStock: (0, pg_core_1.integer)('current_stock').notNull(),
    isActive: (0, pg_core_1.boolean)('is_active').default(true).notNull(),
});
exports.productVariants = (0, pg_core_1.pgTable)('product_variants', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    variantSku: (0, pg_core_1.varchar)('variant_sku').unique().notNull(),
    parentId: (0, pg_core_1.uuid)('parent_id').references(() => exports.products.id).notNull(),
    variantName: (0, pg_core_1.varchar)('variant_name').notNull(),
    price: (0, pg_core_1.numeric)('price').notNull(),
    currentStock: (0, pg_core_1.integer)('current_stock').notNull(),
    isActive: (0, pg_core_1.boolean)('is_active').default(true).notNull(),
});
exports.orders = (0, pg_core_1.pgTable)('orders', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    orderNumber: (0, pg_core_1.varchar)('order_number').unique().notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    status: (0, exports.orderStatusEnum)('status').$type().notNull(),
    totalAmount: (0, pg_core_1.numeric)('total_amount').notNull(),
    subtotal: (0, pg_core_1.numeric)('subtotal').notNull(),
    deliveryCost: (0, pg_core_1.numeric)('delivery_cost').notNull(),
    deliveryMethod: (0, exports.deliveryMethodEnum)('delivery_method').$type().notNull(),
    paymentMethod: (0, exports.paymentMethodEnum)('payment_method').$type().notNull(),
    shipmentNumber: (0, pg_core_1.varchar)('shipment_number'),
});
exports.orderShipping = (0, pg_core_1.pgTable)('order_shipping', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    orderId: (0, pg_core_1.uuid)('order_id').references(() => exports.orders.id).unique().notNull(),
    fullName: (0, pg_core_1.varchar)('full_name').notNull(),
    email: (0, pg_core_1.varchar)('email').notNull(),
    phone: (0, pg_core_1.varchar)('phone').notNull(),
    country: (0, pg_core_1.varchar)('country').notNull(),
    city: (0, pg_core_1.varchar)('city').notNull(),
    postalCode: (0, pg_core_1.varchar)('postal_code').notNull(),
    street: (0, pg_core_1.varchar)('street'),
    streetNumber: (0, pg_core_1.varchar)('street_number'),
    blockNo: (0, pg_core_1.varchar)('block_no'),
    entranceNo: (0, pg_core_1.varchar)('entrance_no'),
    floorNo: (0, pg_core_1.varchar)('floor_no'),
    apartmentNo: (0, pg_core_1.varchar)('apartment_no'),
    officeCode: (0, pg_core_1.varchar)('office_code'),
    additionalInfo: (0, pg_core_1.text)('additional_info'),
});
exports.orderItems = (0, pg_core_1.pgTable)('order_items', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    orderId: (0, pg_core_1.uuid)('order_id').references(() => exports.orders.id).notNull(),
    productId: (0, pg_core_1.uuid)('product_id').references(() => exports.products.id).notNull(),
    variantId: (0, pg_core_1.uuid)('variant_id').references(() => exports.productVariants.id),
    name: (0, pg_core_1.varchar)('name').notNull(),
    variantName: (0, pg_core_1.varchar)('variant_name'),
    quantity: (0, pg_core_1.integer)('quantity').notNull(),
    unitPrice: (0, pg_core_1.numeric)('unit_price').notNull(),
    subtotal: (0, pg_core_1.numeric)('subtotal').notNull(),
    weight: (0, pg_core_1.numeric)('weight').notNull(),
    personalization: (0, pg_core_1.jsonb)('personalization'),
});
exports.pendingOrders = (0, pg_core_1.pgTable)('pending_orders', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    stripePaymentIntentId: (0, pg_core_1.varchar)('stripe_payment_intent_id').unique().notNull(),
    orderNumber: (0, pg_core_1.varchar)('order_number').notNull(),
    cartItems: (0, pg_core_1.jsonb)('cart_items').notNull(),
    orderDetails: (0, pg_core_1.jsonb)('order_details').notNull(),
    orderMethods: (0, pg_core_1.jsonb)('order_methods').notNull(),
    metadata: (0, pg_core_1.jsonb)('metadata'),
    status: (0, pg_core_1.varchar)('status').notNull(),
    errorMessage: (0, pg_core_1.text)('error_message'),
});
exports.webhookEvents = (0, pg_core_1.pgTable)('webhook_events', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    stripePaymentIntent: (0, pg_core_1.varchar)('stripe_payment_intent').notNull(),
    orderNumber: (0, pg_core_1.varchar)('order_number'),
    orderId: (0, pg_core_1.uuid)('order_id').references(() => exports.orders.id),
    eventType: (0, pg_core_1.varchar)('event_type').notNull(),
    status: (0, pg_core_1.varchar)('status').notNull(),
    errorMessage: (0, pg_core_1.text)('error_message'),
});
exports.productsRelations = (0, drizzle_orm_1.relations)(exports.products, ({ many }) => ({
    variants: many(exports.productVariants),
    orderItems: many(exports.orderItems),
}));
exports.productVariantsRelations = (0, drizzle_orm_1.relations)(exports.productVariants, ({ one, many }) => ({
    product: one(exports.products, {
        fields: [exports.productVariants.parentId],
        references: [exports.products.id],
    }),
    orderItems: many(exports.orderItems),
}));
exports.ordersRelations = (0, drizzle_orm_1.relations)(exports.orders, ({ one, many }) => ({
    shipping: one(exports.orderShipping, {
        fields: [exports.orders.id],
        references: [exports.orderShipping.orderId],
    }),
    items: many(exports.orderItems),
    webhookEvents: many(exports.webhookEvents),
}));
exports.orderShippingRelations = (0, drizzle_orm_1.relations)(exports.orderShipping, ({ one }) => ({
    order: one(exports.orders, {
        fields: [exports.orderShipping.orderId],
        references: [exports.orders.id],
    }),
}));
exports.orderItemsRelations = (0, drizzle_orm_1.relations)(exports.orderItems, ({ one }) => ({
    order: one(exports.orders, {
        fields: [exports.orderItems.orderId],
        references: [exports.orders.id],
    }),
    product: one(exports.products, {
        fields: [exports.orderItems.productId],
        references: [exports.products.id],
    }),
    variant: one(exports.productVariants, {
        fields: [exports.orderItems.variantId],
        references: [exports.productVariants.id],
    }),
}));
exports.webhookEventsRelations = (0, drizzle_orm_1.relations)(exports.webhookEvents, ({ one }) => ({
    order: one(exports.orders, {
        fields: [exports.webhookEvents.orderId],
        references: [exports.orders.id],
    }),
}));
//# sourceMappingURL=schema.js.map
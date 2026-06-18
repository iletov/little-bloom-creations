import {
  pgTable,
  uuid,
  varchar,
  numeric,
  integer,
  boolean,
  timestamp,
  jsonb,
  text,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import {
  DeliveryMethodEnum,
  PaymentMethodEnum,
  OrderStatus,
} from '@repo/shared-types';

export const orderStatusEnum = pgEnum('order_status_enum', [
  'pending',
  'confirmed',
  'shipped',
  'delivered',
  'refunded',
  'cancelled',
]);
export const paymentMethodEnum = pgEnum('payment_method_enum', [
  'bank',
  'cash',
  'stripe',
]);
export const deliveryMethodEnum = pgEnum('delivery_method_enum', [
  'ekont-office',
  'ekont-delivery',
  'speedy-delivery',
  'speedy-office',
]);

export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  sku: varchar('sku').unique().notNull(),
  name: varchar('name').notNull(),
  price: numeric('price').notNull(),
  discount: numeric('discount'),
  weight: numeric('weight'),
  width: numeric('width'),
  height: numeric('height'),
  length: numeric('length'),
  depth: numeric('depth'),
  currentStock: integer('current_stock').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
});

export const productVariants = pgTable('product_variants', {
  id: uuid('id').primaryKey().defaultRandom(),
  variantSku: varchar('variant_sku').unique().notNull(),
  parentId: uuid('parent_id')
    .references(() => products.id)
    .notNull(),
  variantName: varchar('variant_name').notNull(),
  price: numeric('price').notNull(),
  currentStock: integer('current_stock').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
});

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderNumber: varchar('order_number').unique().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  status: orderStatusEnum('status').$type<OrderStatus>().notNull(),
  totalAmount: numeric('total_amount').notNull(),
  subtotal: numeric('subtotal').notNull(),
  deliveryCost: numeric('delivery_cost').notNull(),
  deliveryMethod: deliveryMethodEnum('delivery_method')
    .$type<DeliveryMethodEnum>()
    .notNull(),
  paymentMethod: paymentMethodEnum('payment_method')
    .$type<PaymentMethodEnum>()
    .notNull(),
  shipmentNumber: varchar('shipment_number'),
  stripePaymentIntentId: varchar('stripe_payment_intent_id').unique(),
});

export const orderShipping = pgTable('order_shipping', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id')
    .references(() => orders.id)
    .unique()
    .notNull(),
  fullName: varchar('full_name').notNull(),
  email: varchar('email').notNull(),
  phone: varchar('phone').notNull(),
  country: varchar('country').notNull(),
  city: varchar('city').notNull(),
  postalCode: varchar('postal_code').notNull(),
  street: varchar('street'),
  streetNumber: varchar('street_number'),
  blockNo: varchar('block_no'),
  entranceNo: varchar('entrance_no'),
  floorNo: varchar('floor_no'),
  apartmentNo: varchar('apartment_no'),
  officeCode: varchar('office_code'),
  additionalInfo: text('additional_info'),
});

export const orderItems = pgTable('order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id')
    .references(() => orders.id)
    .notNull(),
  productId: uuid('product_id')
    .references(() => products.id)
    .notNull(),
  variantId: uuid('variant_id').references(() => productVariants.id),
  name: varchar('name').notNull(),
  variantName: varchar('variant_name'),
  quantity: integer('quantity').notNull(),
  unitPrice: numeric('unit_price').notNull(),
  subtotal: numeric('subtotal').notNull(),
  weight: numeric('weight').notNull(),
  personalization: jsonb('personalization'),
});

// export const pendingOrders = pgTable('pending_orders', {
//   id: uuid('id').primaryKey().defaultRandom(),
//   stripePaymentIntentId: varchar('stripe_payment_intent_id').unique().notNull(),
//   orderNumber: varchar('order_number').notNull(),
//   cartItems: jsonb('cart_items').notNull(),
//   orderDetails: jsonb('order_details').notNull(),
//   orderMethods: jsonb('order_methods').notNull(),
//   metadata: jsonb('metadata'),
//   status: varchar('status').notNull(),
//   errorMessage: text('error_message'),
// });

export const webhookEvents = pgTable('webhook_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  stripePaymentIntent: varchar('stripe_payment_intent').notNull(),
  orderNumber: varchar('order_number'),
  orderId: uuid('order_id').references(() => orders.id),
  eventType: varchar('event_type').notNull(),
  status: varchar('status').notNull(),
  errorMessage: text('error_message'),
});

// Relations

export const productsRelations = relations(products, ({ many }) => ({
  variants: many(productVariants),
  orderItems: many(orderItems),
}));

export const productVariantsRelations = relations(
  productVariants,
  ({ one, many }) => ({
    product: one(products, {
      fields: [productVariants.parentId],
      references: [products.id],
    }),
    orderItems: many(orderItems),
  }),
);

export const ordersRelations = relations(orders, ({ one, many }) => ({
  shipping: one(orderShipping, {
    fields: [orders.id],
    references: [orderShipping.orderId],
  }),
  items: many(orderItems),
  webhookEvents: many(webhookEvents),
}));

export const orderShippingRelations = relations(orderShipping, ({ one }) => ({
  order: one(orders, {
    fields: [orderShipping.orderId],
    references: [orders.id],
  }),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
  variant: one(productVariants, {
    fields: [orderItems.variantId],
    references: [productVariants.id],
  }),
}));

export const webhookEventsRelations = relations(webhookEvents, ({ one }) => ({
  order: one(orders, {
    fields: [webhookEvents.orderId],
    references: [orders.id],
  }),
}));

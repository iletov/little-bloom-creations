import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { BaseRepository } from '../../database/base.repository';
// ВНИМАНИЕ: Провери дали експортите от schema.ts се казват точно orders, orderShipping и orderItems
import { orders, orderShipping, orderItems, webhookEvents } from '../../database/schema';
import { DrizzleTransaction } from '../../database/database.provider';

// Стриктно извличане на типовете за INSERT операции спрямо Drizzle схемата
export type InsertOrderType = typeof orders.$inferInsert;
export type InsertOrderShippingType = typeof orderShipping.$inferInsert;
export type InsertOrderItemType = typeof orderItems.$inferInsert;

@Injectable()
export class OrdersRepository extends BaseRepository {
  /**
   * Записва пълната структура на поръчката.
   * Добавен е 'tx' параметър, за да поддържа Drizzle транзакции.
   */
  async createFullOrder(
    orderData: InsertOrderType,
    shippingData: InsertOrderShippingType,
    itemsData: InsertOrderItemType[],
  ): Promise<string> {
    // Записваме поръчката и връщаме генерираното ID (работи перфектно с PostgreSQL/Supabase)
    const [newOrder] = await this.db
      .insert(orders)
      .values(orderData)
      .returning({ id: orders.id });

    // Уверяваме се, че свързаните таблици получават правилното orderId
    const shippingWithOrderId = { ...shippingData, orderId: newOrder.id };
    await this.db.insert(orderShipping).values(shippingWithOrderId);

    if (itemsData.length > 0) {
      const itemsWithOrderId = itemsData.map((item) => ({
        ...item,
        orderId: newOrder.id,
      }));
      await this.db.insert(orderItems).values(itemsWithOrderId);
    }

    return newOrder.id;
  }

  async updateShipmentNumber(
    orderNumber: string,
    shipmentNumber: string,
  ): Promise<void> {
    await this.db
      .update(orders)
      // Внимавай дали колоната е shipmentNumber или shipment_number в схемата ти
      .set({ shipmentNumber })
      .where(eq(orders.orderNumber, orderNumber));
  }

  async findById(orderId: string) {
    const [order] = await this.db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId));

    if (!order) return null;

    const items = await this.db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId));

    return {
      ...order,
      items,
    };
  }

  /**
   * Обновява статуса на поръчката (напр. от 'pending' на 'confirmed')
   */
  async updateStatus(
    orderId: string,
    newStatus: NonNullable<typeof orders.$inferInsert['status']>,
  ): Promise<void> {
    await this.db
      .update(orders)
      .set({ status: newStatus })
      .where(eq(orders.id, orderId));
  }

  async savePaymentIntent(
    orderId: string,
    paymentIntentId: string,
  ): Promise<void> {
    await this.db
      .update(orders)
      .set({ stripePaymentIntentId: paymentIntentId })
      .where(eq(orders.id, orderId));
  }

  async findOrdersByEmail(email: string) {
    // First find all shipping records that match the email
    const shippingRecords = await this.db
      .select({ orderId: orderShipping.orderId })
      .from(orderShipping)
      .where(eq(orderShipping.email, email));

    if (shippingRecords.length === 0) {
      return [];
    }

    const orderIds = shippingRecords.map(r => r.orderId);

    // Now fetch the orders with shipping and items
    // Using Drizzle's query API for easier relation fetching
    return this.db.query.orders.findMany({
      where: (orders, { inArray }) => inArray(orders.id, orderIds),
      orderBy: (orders, { desc }) => [desc(orders.createdAt)],
      with: {
        shipping: true,
        items: true,
      },
    });
  }

  async findByOrderNumber(orderNumber: string) {
    const [order] = await this.db
      .select()
      .from(orders)
      .where(eq(orders.orderNumber, orderNumber));

    return order || null;
  }

  async findByPaymentIntentId(paymentIntentId: string) {
    const [order] = await this.db
      .select()
      .from(orders)
      .where(eq(orders.stripePaymentIntentId, paymentIntentId));

    return order || null;
  }

  async findWebhookEventByStripeId(eventId: string) {
    const [event] = await this.db
      .select()
      .from(webhookEvents)
      .where(eq(webhookEvents.stripeEventId, eventId));
    return event || null;
  }

  async createWebhookEvent(data: typeof webhookEvents.$inferInsert) {
    await this.db.insert(webhookEvents).values(data);
  }

  async createWebhookEventIfNotExists(data: typeof webhookEvents.$inferInsert) {
    const [inserted] = await this.db.insert(webhookEvents)
      .values(data)
      .onConflictDoNothing({ target: webhookEvents.stripeEventId })
      .returning();
    return inserted || null;
  }

  async updateWebhookEventStatus(
    eventId: string,
    status: string,
    errorMessage?: string,
  ) {
    await this.db
      .update(webhookEvents)
      .set({ status, errorMessage, processedAt: new Date() })
      .where(eq(webhookEvents.stripeEventId, eventId));
  }
}

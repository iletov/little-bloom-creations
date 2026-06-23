import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { BaseRepository } from '../../database/base.repository';
// ВНИМАНИЕ: Провери дали експортите от schema.ts се казват точно orders, orderShipping и orderItems
import { orders, orderShipping, orderItems } from '../../database/schema';
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
    tx?: DrizzleTransaction, // Поддръжка на транзакции
  ): Promise<string> {
    const dbExecutor = tx || this.db;

    // Записваме поръчката и връщаме генерираното ID (работи перфектно с PostgreSQL/Supabase)
    const [newOrder] = await dbExecutor
      .insert(orders)
      .values(orderData)
      .returning({ id: orders.id });

    // Уверяваме се, че свързаните таблици получават правилното orderId
    const shippingWithOrderId = { ...shippingData, orderId: newOrder.id };
    await dbExecutor.insert(orderShipping).values(shippingWithOrderId);

    if (itemsData.length > 0) {
      const itemsWithOrderId = itemsData.map((item) => ({
        ...item,
        orderId: newOrder.id,
      }));
      await dbExecutor.insert(orderItems).values(itemsWithOrderId);
    }

    return newOrder.id;
  }

  async updateShipmentNumber(
    orderNumber: string,
    shipmentNumber: string,
    tx?: any,
  ): Promise<void> {
    const dbExecutor = tx || this.db;
    await dbExecutor
      .update(orders)
      // Внимавай дали колоната е shipmentNumber или shipment_number в схемата ти
      .set({ shipmentNumber })
      .where(eq(orders.orderNumber, orderNumber));
  }

  async findById(orderId: string, tx?: any) {
    const dbExecutor = tx || this.db;

    const [order] = await dbExecutor
      .select()
      .from(orders)
      .where(eq(orders.id, orderId));

    if (!order) return null;

    const items = await dbExecutor
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
    newStatus: string,
    tx?: any,
  ): Promise<void> {
    const dbExecutor = tx || this.db;
    await dbExecutor
      .update(orders)
      .set({ status: newStatus })
      .where(eq(orders.id, orderId));
  }

  async savePaymentIntent(
    orderId: string,
    paymentIntentId: string,
    tx?: any,
  ): Promise<void> {
    const dbExecutor = tx || this.db;
    await dbExecutor
      .update(orders)
      .set({ stripePaymentIntentId: paymentIntentId })
      .where(eq(orders.id, orderId));
  }

  async findOrdersByEmail(email: string, tx?: any) {
    const dbExecutor = tx || this.db;

    // First find all shipping records that match the email
    const shippingRecords = await dbExecutor
      .select({ orderId: orderShipping.orderId })
      .from(orderShipping)
      .where(eq(orderShipping.email, email));

    if (shippingRecords.length === 0) {
      return [];
    }

    const orderIds = shippingRecords.map(r => r.orderId);

    // Now fetch the orders with shipping and items
    // Using Drizzle's query API for easier relation fetching
    return dbExecutor.query.orders.findMany({
      where: (orders, { inArray }) => inArray(orders.id, orderIds),
      orderBy: (orders, { desc }) => [desc(orders.createdAt)],
      with: {
        shipping: true,
        items: true,
      },
    });
  }

  async findByOrderNumber(orderNumber: string, tx?: any) {
    const dbExecutor = tx || this.db;

    const [order] = await dbExecutor
      .select()
      .from(orders)
      .where(eq(orders.orderNumber, orderNumber));

    return order || null;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../database/database.provider';
import { orders, products, productVariants } from '../database/schema';
import { eq, and, gte, inArray, sql, desc } from 'drizzle-orm';

@Injectable()
export class AdminRepository {
  // --- METRICS ---
  async getMetrics(chartStartDate: Date, days: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [todayStats] = await db
      .select({
        revenue: sql<number>`COALESCE(SUM(${orders.subtotal}), 0)`,
        count: sql<number>`COUNT(*)`,
      })
      .from(orders)
      .where(
        and(
          inArray(orders.status, ['confirmed', 'shipped']),
          gte(orders.createdAt, today),
        ),
      );

    const [allStats] = await db
      .select({
        revenue: sql<number>`COALESCE(SUM(${orders.subtotal}), 0)`,
      })
      .from(orders)
      .where(inArray(orders.status, ['confirmed', 'shipped']));

    const [pendingStats] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(orders)
      .where(eq(orders.status, 'pending'));

    const [productsCountResult] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(products)
      .where(eq(products.isActive, true));

    const [variantsCountResult] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(productVariants)
      .where(eq(productVariants.isActive, true));

    const chartStats = await db
      .select({
        date: sql<string>`DATE(${orders.createdAt})`,
        revenue: sql<number>`COALESCE(SUM(${orders.subtotal}), 0)`,
      })
      .from(orders)
      .where(
        and(
          inArray(orders.status, ['confirmed', 'shipped']),
          gte(orders.createdAt, chartStartDate),
        ),
      )
      .groupBy(sql`DATE(${orders.createdAt})`)
      .orderBy(sql`DATE(${orders.createdAt})`);

    const deliveryStats = await db
      .select({
        method: orders.deliveryMethod,
        count: sql<number>`COUNT(*)`,
      })
      .from(orders)
      .where(
        and(
          inArray(orders.status, ['confirmed', 'shipped']),
          gte(orders.createdAt, chartStartDate),
        ),
      )
      .groupBy(orders.deliveryMethod);

    return {
      todayStats,
      allStats,
      pendingStats,
      productsCountResult,
      variantsCountResult,
      chartStats,
      deliveryStats,
    };
  }

  // --- ORDERS ---
  async getAllOrdersWithBasicShipping() {
    return db.query.orders.findMany({
      orderBy: [desc(orders.createdAt)],
      with: {
        shipping: {
          columns: {
            fullName: true,
            email: true,
          },
        },
      },
    });
  }

  async getOrderByNumber(orderNumber: string) {
    return db.query.orders.findFirst({
      where: eq(orders.orderNumber, orderNumber),
      with: {
        shipping: true,
        items: {
          with: {
            product: true,
          },
        },
      },
    });
  }

  async updateOrder(orderId: string, dbUpdates: Record<string, unknown>) {
    const result = await db
      .update(orders)
      .set(dbUpdates)
      .where(eq(orders.id, orderId))
      .returning();

    if (result.length === 0) {
      const resultByNum = await db
        .update(orders)
        .set(dbUpdates)
        .where(eq(orders.orderNumber, orderId))
        .returning();

      if (resultByNum.length === 0) {
        throw new NotFoundException(`Order ${orderId} not found`);
      }
      return resultByNum[0];
    }

    return result[0];
  }

  // --- WAYBILL ---
  async getOrderWithShipping(orderId: string) {
    return db.query.orders.findFirst({
      where: eq(orders.id, orderId),
      with: {
        shipping: true,
      },
    });
  }

  async saveWaybill(
    orderId: string,
    shipmentNumber: string,
    deliveryCost?: string,
  ) {
    const updateData: Record<string, unknown> = {
      shipmentNumber,
      status: 'shipped',
    };
    if (deliveryCost) {
      updateData.deliveryCost = deliveryCost;
    }

    await db.update(orders).set(updateData).where(eq(orders.id, orderId));
  }

  // --- CANCELLATION ---
  async getOrderWithItems(orderId: string) {
    return db.query.orders.findFirst({
      where: eq(orders.id, orderId),
      with: {
        items: true,
      },
    });
  }

  async cancelOrderAndRestoreStock(orderId: string, items: any[]) {
    // Perform sequentially or in parallel without breaking structure
    if (items && items.length > 0) {
      for (const item of items) {
        await db
          .update(products)
          .set({ currentStock: sql`${products.currentStock} + ${item.quantity}` })
          .where(eq(products.id, item.productId));

        if (item.variantId) {
          await db
            .update(productVariants)
            .set({ currentStock: sql`${productVariants.currentStock} + ${item.quantity}` })
            .where(eq(productVariants.id, item.variantId));
        }
      }
    }

    const [updatedOrder] = await db
      .update(orders)
      .set({ status: 'cancelled' })
      .where(eq(orders.id, orderId))
      .returning();

    return updatedOrder;
  }
}

import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { BaseRepository } from '../../database/base.repository';
// ВНИМАНИЕ: Провери дали експортите от schema.ts се казват точно orders, orderShipping и orderItems
import { orders, orderShipping, orderItems } from '../../database/schema';

// Стриктно извличане на типовете за INSERT операции спрямо Drizzle схемата
export type InsertOrderType = typeof orders.$inferInsert;
export type InsertOrderShippingType = typeof orderShipping.$inferInsert;
export type InsertOrderItemType = typeof orderItems.$inferInsert;

@Injectable()
export class OrdersRepository extends BaseRepository {
  /**
   * Записва пълната структура на поръчката.
   */
  async createFullOrder(
    orderData: InsertOrderType,
    shippingData: InsertOrderShippingType,
    itemsData: InsertOrderItemType[],
  ): Promise<void> {
    await this.db.insert(orders).values(orderData);
    await this.db.insert(orderShipping).values(shippingData);

    // Performance Rule: Bulk Insert за артикулите
    if (itemsData.length > 0) {
      await this.db.insert(orderItems).values(itemsData);
    }
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
}

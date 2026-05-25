import { BaseRepository } from '../../database/base.repository';
import { orders, orderShipping, orderItems } from '../../database/schema';
export type InsertOrderType = typeof orders.$inferInsert;
export type InsertOrderShippingType = typeof orderShipping.$inferInsert;
export type InsertOrderItemType = typeof orderItems.$inferInsert;
export declare class OrdersRepository extends BaseRepository {
    createFullOrder(orderData: InsertOrderType, shippingData: InsertOrderShippingType, itemsData: InsertOrderItemType[]): Promise<void>;
    updateShipmentNumber(orderNumber: string, shipmentNumber: string): Promise<void>;
}

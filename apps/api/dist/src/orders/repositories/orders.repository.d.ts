import { BaseRepository } from '../../database/base.repository';
import { orders, orderShipping, orderItems, webhookEvents } from '../../database/schema';
import { DrizzleTransaction } from '../../database/database.provider';
export type InsertOrderType = typeof orders.$inferInsert;
export type InsertOrderShippingType = typeof orderShipping.$inferInsert;
export type InsertOrderItemType = typeof orderItems.$inferInsert;
export declare class OrdersRepository extends BaseRepository {
    createFullOrder(orderData: InsertOrderType, shippingData: InsertOrderShippingType, itemsData: InsertOrderItemType[], tx?: DrizzleTransaction): Promise<string>;
    updateShipmentNumber(orderNumber: string, shipmentNumber: string, tx?: any): Promise<void>;
    findById(orderId: string, tx?: any): Promise<any>;
    updateStatus(orderId: string, newStatus: string, tx?: any): Promise<void>;
    savePaymentIntent(orderId: string, paymentIntentId: string, tx?: any): Promise<void>;
    findOrdersByEmail(email: string, tx?: any): Promise<any>;
    findByOrderNumber(orderNumber: string, tx?: any): Promise<any>;
    findWebhookEventByStripeId(eventId: string, tx?: any): Promise<any>;
    createWebhookEvent(data: typeof webhookEvents.$inferInsert, tx?: any): Promise<void>;
    updateWebhookEventStatus(eventId: string, status: string, errorMessage?: string, tx?: any): Promise<void>;
}

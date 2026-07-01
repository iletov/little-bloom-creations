"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersRepository = void 0;
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const base_repository_1 = require("../../database/base.repository");
const schema_1 = require("../../database/schema");
let OrdersRepository = class OrdersRepository extends base_repository_1.BaseRepository {
    async createFullOrder(orderData, shippingData, itemsData, tx) {
        const dbExecutor = tx || this.db;
        const [newOrder] = await dbExecutor
            .insert(schema_1.orders)
            .values(orderData)
            .returning({ id: schema_1.orders.id });
        const shippingWithOrderId = { ...shippingData, orderId: newOrder.id };
        await dbExecutor.insert(schema_1.orderShipping).values(shippingWithOrderId);
        if (itemsData.length > 0) {
            const itemsWithOrderId = itemsData.map((item) => ({
                ...item,
                orderId: newOrder.id,
            }));
            await dbExecutor.insert(schema_1.orderItems).values(itemsWithOrderId);
        }
        return newOrder.id;
    }
    async updateShipmentNumber(orderNumber, shipmentNumber, tx) {
        const dbExecutor = tx || this.db;
        await dbExecutor
            .update(schema_1.orders)
            .set({ shipmentNumber })
            .where((0, drizzle_orm_1.eq)(schema_1.orders.orderNumber, orderNumber));
    }
    async findById(orderId, tx) {
        const dbExecutor = tx || this.db;
        const [order] = await dbExecutor
            .select()
            .from(schema_1.orders)
            .where((0, drizzle_orm_1.eq)(schema_1.orders.id, orderId));
        if (!order)
            return null;
        const items = await dbExecutor
            .select()
            .from(schema_1.orderItems)
            .where((0, drizzle_orm_1.eq)(schema_1.orderItems.orderId, orderId));
        return {
            ...order,
            items,
        };
    }
    async updateStatus(orderId, newStatus, tx) {
        const dbExecutor = tx || this.db;
        await dbExecutor
            .update(schema_1.orders)
            .set({ status: newStatus })
            .where((0, drizzle_orm_1.eq)(schema_1.orders.id, orderId));
    }
    async savePaymentIntent(orderId, paymentIntentId, tx) {
        const dbExecutor = tx || this.db;
        await dbExecutor
            .update(schema_1.orders)
            .set({ stripePaymentIntentId: paymentIntentId })
            .where((0, drizzle_orm_1.eq)(schema_1.orders.id, orderId));
    }
    async findOrdersByEmail(email, tx) {
        const dbExecutor = tx || this.db;
        const shippingRecords = await dbExecutor
            .select({ orderId: schema_1.orderShipping.orderId })
            .from(schema_1.orderShipping)
            .where((0, drizzle_orm_1.eq)(schema_1.orderShipping.email, email));
        if (shippingRecords.length === 0) {
            return [];
        }
        const orderIds = shippingRecords.map(r => r.orderId);
        return dbExecutor.query.orders.findMany({
            where: (orders, { inArray }) => inArray(orders.id, orderIds),
            orderBy: (orders, { desc }) => [desc(orders.createdAt)],
            with: {
                shipping: true,
                items: true,
            },
        });
    }
    async findByOrderNumber(orderNumber, tx) {
        const dbExecutor = tx || this.db;
        const [order] = await dbExecutor
            .select()
            .from(schema_1.orders)
            .where((0, drizzle_orm_1.eq)(schema_1.orders.orderNumber, orderNumber));
        return order || null;
    }
    async findWebhookEventByStripeId(eventId, tx) {
        const dbExecutor = tx || this.db;
        const [event] = await dbExecutor
            .select()
            .from(schema_1.webhookEvents)
            .where((0, drizzle_orm_1.eq)(schema_1.webhookEvents.stripeEventId, eventId));
        return event || null;
    }
    async createWebhookEvent(data, tx) {
        const dbExecutor = tx || this.db;
        await dbExecutor.insert(schema_1.webhookEvents).values(data);
    }
    async updateWebhookEventStatus(eventId, status, errorMessage, tx) {
        const dbExecutor = tx || this.db;
        await dbExecutor
            .update(schema_1.webhookEvents)
            .set({ status, errorMessage, processedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_1.webhookEvents.stripeEventId, eventId));
    }
};
exports.OrdersRepository = OrdersRepository;
exports.OrdersRepository = OrdersRepository = __decorate([
    (0, common_1.Injectable)()
], OrdersRepository);
//# sourceMappingURL=orders.repository.js.map
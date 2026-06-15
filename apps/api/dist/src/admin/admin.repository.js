"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRepository = void 0;
const common_1 = require("@nestjs/common");
const database_provider_1 = require("../database/database.provider");
const schema_1 = require("../database/schema");
const drizzle_orm_1 = require("drizzle-orm");
let AdminRepository = class AdminRepository {
    async getMetrics(chartStartDate, days) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const [todayStats] = await database_provider_1.db
            .select({
            revenue: (0, drizzle_orm_1.sql) `COALESCE(SUM(${schema_1.orders.subtotal}), 0)`,
            count: (0, drizzle_orm_1.sql) `COUNT(*)`,
        })
            .from(schema_1.orders)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.inArray)(schema_1.orders.status, ['confirmed', 'shipped']), (0, drizzle_orm_1.gte)(schema_1.orders.createdAt, today)));
        const [allStats] = await database_provider_1.db
            .select({
            revenue: (0, drizzle_orm_1.sql) `COALESCE(SUM(${schema_1.orders.subtotal}), 0)`,
        })
            .from(schema_1.orders)
            .where((0, drizzle_orm_1.inArray)(schema_1.orders.status, ['confirmed', 'shipped']));
        const [pendingStats] = await database_provider_1.db
            .select({ count: (0, drizzle_orm_1.sql) `COUNT(*)` })
            .from(schema_1.orders)
            .where((0, drizzle_orm_1.eq)(schema_1.orders.status, 'pending'));
        const [productsCountResult] = await database_provider_1.db
            .select({ count: (0, drizzle_orm_1.sql) `COUNT(*)` })
            .from(schema_1.products)
            .where((0, drizzle_orm_1.eq)(schema_1.products.isActive, true));
        const [variantsCountResult] = await database_provider_1.db
            .select({ count: (0, drizzle_orm_1.sql) `COUNT(*)` })
            .from(schema_1.productVariants)
            .where((0, drizzle_orm_1.eq)(schema_1.productVariants.isActive, true));
        const chartStats = await database_provider_1.db
            .select({
            date: (0, drizzle_orm_1.sql) `DATE(${schema_1.orders.createdAt})`,
            revenue: (0, drizzle_orm_1.sql) `COALESCE(SUM(${schema_1.orders.subtotal}), 0)`,
        })
            .from(schema_1.orders)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.inArray)(schema_1.orders.status, ['confirmed', 'shipped']), (0, drizzle_orm_1.gte)(schema_1.orders.createdAt, chartStartDate)))
            .groupBy((0, drizzle_orm_1.sql) `DATE(${schema_1.orders.createdAt})`)
            .orderBy((0, drizzle_orm_1.sql) `DATE(${schema_1.orders.createdAt})`);
        const deliveryStats = await database_provider_1.db
            .select({
            method: schema_1.orders.deliveryMethod,
            count: (0, drizzle_orm_1.sql) `COUNT(*)`,
        })
            .from(schema_1.orders)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.inArray)(schema_1.orders.status, ['confirmed', 'shipped']), (0, drizzle_orm_1.gte)(schema_1.orders.createdAt, chartStartDate)))
            .groupBy(schema_1.orders.deliveryMethod);
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
    async getAllOrdersWithBasicShipping() {
        return database_provider_1.db.query.orders.findMany({
            orderBy: [(0, drizzle_orm_1.desc)(schema_1.orders.createdAt)],
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
    async getOrderByNumber(orderNumber) {
        return database_provider_1.db.query.orders.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.orders.orderNumber, orderNumber),
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
    async updateOrder(orderId, dbUpdates) {
        const result = await database_provider_1.db
            .update(schema_1.orders)
            .set(dbUpdates)
            .where((0, drizzle_orm_1.eq)(schema_1.orders.id, orderId))
            .returning();
        if (result.length === 0) {
            const resultByNum = await database_provider_1.db
                .update(schema_1.orders)
                .set(dbUpdates)
                .where((0, drizzle_orm_1.eq)(schema_1.orders.orderNumber, orderId))
                .returning();
            if (resultByNum.length === 0) {
                throw new common_1.NotFoundException(`Order ${orderId} not found`);
            }
            return resultByNum[0];
        }
        return result[0];
    }
    async getOrderWithShipping(orderId) {
        return database_provider_1.db.query.orders.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.orders.id, orderId),
            with: {
                shipping: true,
            },
        });
    }
    async saveWaybill(orderId, shipmentNumber, deliveryCost) {
        const updateData = {
            shipmentNumber,
            status: 'shipped',
        };
        if (deliveryCost) {
            updateData.deliveryCost = deliveryCost;
        }
        await database_provider_1.db.update(schema_1.orders).set(updateData).where((0, drizzle_orm_1.eq)(schema_1.orders.id, orderId));
    }
    async getOrderWithItems(orderId) {
        return database_provider_1.db.query.orders.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.orders.id, orderId),
            with: {
                items: true,
            },
        });
    }
    async cancelOrderAndRestoreStock(orderId, items) {
        if (items && items.length > 0) {
            for (const item of items) {
                await database_provider_1.db
                    .update(schema_1.products)
                    .set({ currentStock: (0, drizzle_orm_1.sql) `${schema_1.products.currentStock} + ${item.quantity}` })
                    .where((0, drizzle_orm_1.eq)(schema_1.products.id, item.productId));
                if (item.variantId) {
                    await database_provider_1.db
                        .update(schema_1.productVariants)
                        .set({ currentStock: (0, drizzle_orm_1.sql) `${schema_1.productVariants.currentStock} + ${item.quantity}` })
                        .where((0, drizzle_orm_1.eq)(schema_1.productVariants.id, item.variantId));
                }
            }
        }
        const [updatedOrder] = await database_provider_1.db
            .update(schema_1.orders)
            .set({ status: 'cancelled' })
            .where((0, drizzle_orm_1.eq)(schema_1.orders.id, orderId))
            .returning();
        return updatedOrder;
    }
};
exports.AdminRepository = AdminRepository;
exports.AdminRepository = AdminRepository = __decorate([
    (0, common_1.Injectable)()
], AdminRepository);
//# sourceMappingURL=admin.repository.js.map
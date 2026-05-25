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
    async createFullOrder(orderData, shippingData, itemsData) {
        await this.db.insert(schema_1.orders).values(orderData);
        await this.db.insert(schema_1.orderShipping).values(shippingData);
        if (itemsData.length > 0) {
            await this.db.insert(schema_1.orderItems).values(itemsData);
        }
    }
    async updateShipmentNumber(orderNumber, shipmentNumber) {
        await this.db
            .update(schema_1.orders)
            .set({ shipmentNumber })
            .where((0, drizzle_orm_1.eq)(schema_1.orders.orderNumber, orderNumber));
    }
};
exports.OrdersRepository = OrdersRepository;
exports.OrdersRepository = OrdersRepository = __decorate([
    (0, common_1.Injectable)()
], OrdersRepository);
//# sourceMappingURL=orders.repository.js.map
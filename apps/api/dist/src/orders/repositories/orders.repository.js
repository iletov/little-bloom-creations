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
const base_repository_1 = require("../../database/base.repository");
let OrdersRepository = class OrdersRepository extends base_repository_1.BaseRepository {
    async createOrder(orderData, items, shipping) {
        throw new Error('Method not implemented.');
    }
    async findById(id) {
        throw new Error('Method not implemented.');
    }
    async findByOrderNumber(orderNumber) {
        throw new Error('Method not implemented.');
    }
};
exports.OrdersRepository = OrdersRepository;
exports.OrdersRepository = OrdersRepository = __decorate([
    (0, common_1.Injectable)()
], OrdersRepository);
//# sourceMappingURL=orders.repository.js.map
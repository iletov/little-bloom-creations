"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetOrderStatusUseCase = void 0;
const common_1 = require("@nestjs/common");
const orders_repository_1 = require("../repositories/orders.repository");
let GetOrderStatusUseCase = class GetOrderStatusUseCase {
    ordersRepo;
    constructor(ordersRepo) {
        this.ordersRepo = ordersRepo;
    }
    async execute(orderNumber) {
        const order = await this.ordersRepo.findByOrderNumber(orderNumber);
        if (!order) {
            throw new common_1.NotFoundException(`Order with number ${orderNumber} not found`);
        }
        let mappedStatus = 'pending';
        let message = 'Processing your order. Please wait...';
        if (order.status === 'confirmed' || order.status === 'shipped' || order.status === 'delivered') {
            mappedStatus = 'success';
            message = order.status === 'delivered' ? 'Order delivered successfully!' : 'Order created successfully!';
        }
        else if (order.status === 'cancelled') {
            mappedStatus = 'failed';
            message = 'Order creation failed or was cancelled.';
        }
        else if (order.status === 'refunded') {
            mappedStatus = 'refunded';
            message = 'Payment refunded.';
        }
        return {
            status: mappedStatus,
            order: {
                id: order.id,
                total_amount: order.totalAmount,
                created_at: order.createdAt,
                order_number: order.orderNumber,
                payment_method: order.paymentMethod,
            },
            order_number: order.orderNumber,
            message,
        };
    }
};
exports.GetOrderStatusUseCase = GetOrderStatusUseCase;
exports.GetOrderStatusUseCase = GetOrderStatusUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [orders_repository_1.OrdersRepository])
], GetOrderStatusUseCase);
//# sourceMappingURL=get-order-status.use-case.js.map
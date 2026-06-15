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
var AdminCancellationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminCancellationService = void 0;
const common_1 = require("@nestjs/common");
const admin_repository_1 = require("./admin.repository");
const stripe_service_1 = require("../stripe/stripe.service");
let AdminCancellationService = AdminCancellationService_1 = class AdminCancellationService {
    stripeService;
    adminRepository;
    logger = new common_1.Logger(AdminCancellationService_1.name);
    constructor(stripeService, adminRepository) {
        this.stripeService = stripeService;
        this.adminRepository = adminRepository;
    }
    async cancelOrder(orderId) {
        const orderData = await this.adminRepository.getOrderWithItems(orderId);
        if (!orderData) {
            throw new common_1.BadRequestException(`Order ${orderId} not found`);
        }
        if (orderData.status === 'cancelled') {
            throw new common_1.BadRequestException('Order is already cancelled');
        }
        if (orderData.paymentMethod === 'stripe' && orderData.stripePaymentIntentId) {
            try {
                if (['confirmed', 'shipped', 'processing'].includes(orderData.status)) {
                    await this.stripeService.refundPayment(orderData.stripePaymentIntentId, 'requested_by_customer');
                    this.logger.log(`Refunded Stripe Payment ${orderData.stripePaymentIntentId} for Order ${orderId}`);
                }
                else if (orderData.status === 'pending') {
                    await this.stripeService.cancelPayment(orderData.stripePaymentIntentId, 'requested_by_customer');
                    this.logger.log(`Canceled pending Stripe Payment ${orderData.stripePaymentIntentId} for Order ${orderId}`);
                }
            }
            catch (error) {
                this.logger.error(`Failed to reverse payment for order ${orderId}`, error);
                throw new common_1.BadRequestException(`Could not reverse Stripe payment: ${error.message}`);
            }
        }
        const updatedOrder = await this.adminRepository.cancelOrderAndRestoreStock(orderId, orderData.items || []);
        this.logger.log(`Restored inventory for order ${orderId}`);
        return {
            success: true,
            message: 'Order cancelled successfully',
            order: updatedOrder,
        };
    }
};
exports.AdminCancellationService = AdminCancellationService;
exports.AdminCancellationService = AdminCancellationService = AdminCancellationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [stripe_service_1.StripeService,
        admin_repository_1.AdminRepository])
], AdminCancellationService);
//# sourceMappingURL=admin-cancellation.service.js.map
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
var ConfirmStripeOrderUseCase_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfirmStripeOrderUseCase = void 0;
const common_1 = require("@nestjs/common");
const orders_repository_1 = require("../repositories/orders.repository");
const products_repository_1 = require("../../products/products.repository");
const stripe_service_1 = require("../../stripe/stripe.service");
const transaction_manager_1 = require("../../database/transaction.manager");
let ConfirmStripeOrderUseCase = ConfirmStripeOrderUseCase_1 = class ConfirmStripeOrderUseCase {
    ordersRepo;
    productsRepo;
    stripeService;
    logger = new common_1.Logger(ConfirmStripeOrderUseCase_1.name);
    constructor(ordersRepo, productsRepo, stripeService) {
        this.ordersRepo = ordersRepo;
        this.productsRepo = productsRepo;
        this.stripeService = stripeService;
    }
    async execute(orderId, paymentIntentId) {
        try {
            await transaction_manager_1.TransactionManager.runInTransaction(async () => {
                const order = await this.ordersRepo.findById(orderId);
                if (!order) {
                    throw new common_1.BadRequestException(`Order with id ${orderId} not found`);
                }
                for (const item of order.items) {
                    await this.productsRepo.decreaseStockSafelyById(item.productId, item.variantId, item.quantity);
                }
                await this.stripeService.capturePayment(paymentIntentId);
                await this.ordersRepo.updateStatus(orderId, 'confirmed');
                await this.ordersRepo.savePaymentIntent(orderId, paymentIntentId);
            });
        }
        catch (error) {
            this.logger.error(`Failed to confirm order ${orderId}:`, error);
            try {
                await this.stripeService.cancelPayment(paymentIntentId);
                this.logger.log(`Payment intent ${paymentIntentId} was cancelled due to stock availability or other error.`);
            }
            catch (cancelError) {
                this.logger.error(`Failed to cancel Stripe payment ${paymentIntentId} for order ${orderId}:`, cancelError);
            }
            try {
                await this.ordersRepo.updateStatus(orderId, 'cancelled');
            }
            catch (statusError) {
                this.logger.error(`Failed to update order ${orderId} status to cancelled:`, statusError);
            }
            throw new common_1.InternalServerErrorException('Error confirming Stripe order. Payment cancelled.');
        }
    }
};
exports.ConfirmStripeOrderUseCase = ConfirmStripeOrderUseCase;
exports.ConfirmStripeOrderUseCase = ConfirmStripeOrderUseCase = ConfirmStripeOrderUseCase_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [orders_repository_1.OrdersRepository,
        products_repository_1.ProductsRepository,
        stripe_service_1.StripeService])
], ConfirmStripeOrderUseCase);
//# sourceMappingURL=confirm-stripe-order.use-case.js.map
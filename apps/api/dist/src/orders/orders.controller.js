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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const place_cash_order_use_case_1 = require("./use-cases/place-cash-order.use-case");
const place_cash_order_dto_1 = require("./dto/place-cash-order.dto");
const initiate_stripe_order_use_case_1 = require("./use-cases/initiate-stripe-order.use-case");
const stripe_service_1 = require("../stripe/stripe.service");
const place_stripe_order_dto_1 = require("./dto/place-stripe-order.dto");
const confirm_stripe_order_use_case_1 = require("./use-cases/confirm-stripe-order.use-case");
let OrdersController = class OrdersController {
    placeCashOrderUseCase;
    initiateStripeOrderUseCase;
    confirmStripeOrderUseCase;
    stripeService;
    constructor(placeCashOrderUseCase, initiateStripeOrderUseCase, confirmStripeOrderUseCase, stripeService) {
        this.placeCashOrderUseCase = placeCashOrderUseCase;
        this.initiateStripeOrderUseCase = initiateStripeOrderUseCase;
        this.confirmStripeOrderUseCase = confirmStripeOrderUseCase;
        this.stripeService = stripeService;
    }
    async placeCashOrder(dto) {
        return this.placeCashOrderUseCase.execute(dto);
    }
    async initiateStripeOrder(dto) {
        const result = await this.initiateStripeOrderUseCase.execute(dto);
        return {
            orderNumber: result.orderNumber,
            clientSecret: result.clientSecret ?? undefined,
        };
    }
    async handleStripeWebhook(req, signature) {
        if (!signature || !req.rawBody) {
            throw new common_1.BadRequestException('Missing signature or raw body');
        }
        let event;
        try {
            event = this.stripeService.constructEvent(req.rawBody, signature);
        }
        catch (err) {
            throw new common_1.BadRequestException(`Webhook Error: ${err.message}`);
        }
        if (event.type === 'payment_intent.succeeded') {
            const paymentIntent = event.data.object;
            const orderId = paymentIntent.metadata.orderId;
            try {
                await this.confirmStripeOrderUseCase.execute(orderId, paymentIntent.id);
                console.log(`[Stripe Webhook] Order ${orderId} confirmed.`);
            }
            catch (error) {
                console.error(`[Stripe Webhook] Fulfillment failed for ${orderId}:`, error);
                await this.stripeService.refundPayment(paymentIntent.id, error.message);
            }
        }
        return { received: true };
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Post)('cash'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [place_cash_order_dto_1.PlaceCashOrderDto]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "placeCashOrder", null);
__decorate([
    (0, common_1.Post)('stripe/initiate'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [place_stripe_order_dto_1.PlaceStripeOrderDto]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "initiateStripeOrder", null);
__decorate([
    (0, common_1.Post)('stripe/webhook'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Headers)('stripe-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "handleStripeWebhook", null);
exports.OrdersController = OrdersController = __decorate([
    (0, common_1.Controller)('orders'),
    __metadata("design:paramtypes", [place_cash_order_use_case_1.PlaceCashOrderUseCase,
        initiate_stripe_order_use_case_1.InitiateStripeOrderUseCase,
        confirm_stripe_order_use_case_1.ConfirmStripeOrderUseCase,
        stripe_service_1.StripeService])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map
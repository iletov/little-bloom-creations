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
const cancel_stripe_order_use_case_1 = require("./use-cases/cancel-stripe-order.use-case");
const cancel_stripe_order_dto_1 = require("./dto/cancel-stripe-order.dto");
const get_order_status_use_case_1 = require("./use-cases/get-order-status.use-case");
const get_user_orders_use_case_1 = require("./use-cases/get-user-orders.use-case");
const supabase_user_guard_1 = require("../common/guards/supabase-user.guard");
const orders_repository_1 = require("./repositories/orders.repository");
let OrdersController = class OrdersController {
    placeCashOrderUseCase;
    initiateStripeOrderUseCase;
    confirmStripeOrderUseCase;
    cancelStripeOrderUseCase;
    getOrderStatusUseCase;
    getUserOrdersUseCase;
    stripeService;
    ordersRepo;
    constructor(placeCashOrderUseCase, initiateStripeOrderUseCase, confirmStripeOrderUseCase, cancelStripeOrderUseCase, getOrderStatusUseCase, getUserOrdersUseCase, stripeService, ordersRepo) {
        this.placeCashOrderUseCase = placeCashOrderUseCase;
        this.initiateStripeOrderUseCase = initiateStripeOrderUseCase;
        this.confirmStripeOrderUseCase = confirmStripeOrderUseCase;
        this.cancelStripeOrderUseCase = cancelStripeOrderUseCase;
        this.getOrderStatusUseCase = getOrderStatusUseCase;
        this.getUserOrdersUseCase = getUserOrdersUseCase;
        this.stripeService = stripeService;
        this.ordersRepo = ordersRepo;
    }
    async getMyOrders(req) {
        const userEmail = req.user?.email;
        if (!userEmail) {
            throw new common_1.BadRequestException('User email not found in session');
        }
        return this.getUserOrdersUseCase.execute(userEmail);
    }
    async getOrderStatus(orderNumber) {
        return this.getOrderStatusUseCase.execute(orderNumber);
    }
    async placeCashOrder(dto) {
        return this.placeCashOrderUseCase.execute(dto);
    }
    async initiateStripeOrder(dto) {
        const result = await this.initiateStripeOrderUseCase.execute(dto);
        return {
            orderNumber: result.orderNumber,
            clientSecret: result.clientSecret ?? undefined,
            paymentIntentId: result.paymentIntentId,
        };
    }
    async cancelStripeOrder(dto) {
        return this.cancelStripeOrderUseCase.execute(dto);
    }
    async handleStripeWebhook(req, signature) {
        if (!signature || !req.rawBody) {
            throw new common_1.BadRequestException('Missing signature or raw body');
        }
        let event;
        const getErrorMessage = (error) => error instanceof Error ? error.message : 'Unknown error';
        try {
            event = this.stripeService.constructEvent(req.rawBody, signature);
        }
        catch (err) {
            throw new common_1.BadRequestException(`Webhook Error: ${getErrorMessage(err)}`);
        }
        let paymentIntentId = 'unknown';
        let orderId = null;
        let orderNumber = null;
        if (event.type === 'charge.refunded') {
            const charge = event.data.object;
            paymentIntentId =
                typeof charge.payment_intent === 'string'
                    ? charge.payment_intent
                    : charge.payment_intent?.id || 'unknown';
        }
        else {
            const paymentIntent = event.data.object;
            paymentIntentId = paymentIntent?.id || 'unknown';
            orderId = paymentIntent?.metadata?.orderId || null;
            orderNumber = paymentIntent?.metadata?.orderNumber || null;
        }
        console.log(`[Stripe Webhook] Received ${event.type} for PaymentIntent ${paymentIntentId}`);
        const createdEvent = await this.ordersRepo.createWebhookEventIfNotExists({
            stripeEventId: event.id,
            stripePaymentIntent: paymentIntentId,
            orderId: orderId,
            orderNumber: orderNumber,
            eventType: event.type,
            status: 'pending',
            payload: event,
        });
        if (!createdEvent) {
            console.log(`[Stripe Webhook] Skipping duplicate event ${event.id}`);
            return { received: true };
        }
        try {
            if (event.type === 'charge.refunded') {
                const order = await this.ordersRepo.findByPaymentIntentId(paymentIntentId);
                if (!order) {
                    console.log(`[Stripe Webhook] Order not found for charge.refunded event ${event.id}`);
                    await this.ordersRepo.updateWebhookEventStatus(event.id, 'ignored', 'Order not found');
                    return { received: true };
                }
                await this.ordersRepo.updateStatus(order.id, 'refunded');
                console.log(`[Stripe Webhook] Order ${order.id} marked as refunded.`);
                await this.ordersRepo.updateWebhookEventStatus(event.id, 'success');
                return { received: true };
            }
            if (!orderId) {
                console.log(`[Stripe Webhook] No orderId in metadata for event ${event.id}`);
                await this.ordersRepo.updateWebhookEventStatus(event.id, 'ignored', 'Missing orderId in metadata');
                return { received: true };
            }
            const order = await this.ordersRepo.findById(orderId);
            if (!order) {
                console.error(`[Stripe Webhook] Order ${orderId} not found for event ${event.id}`);
                await this.ordersRepo.updateWebhookEventStatus(event.id, 'ignored', 'Order not found');
                return { received: true };
            }
            switch (event.type) {
                case 'payment_intent.amount_capturable_updated': {
                    if (['confirmed', 'cancelled', 'failed', 'refunded'].includes(order.status)) {
                        console.log(`[Stripe Webhook] Order ${orderId} already ${order.status}, skipping fulfillment`);
                        await this.ordersRepo.updateWebhookEventStatus(event.id, 'duplicate', `Order already ${order.status}`);
                        break;
                    }
                    await this.confirmStripeOrderUseCase.execute(orderId, paymentIntentId);
                    await this.ordersRepo.updateWebhookEventStatus(event.id, 'success');
                    console.log(`[Stripe Webhook] Order ${orderId} confirmed via capture.`);
                    break;
                }
                case 'payment_intent.succeeded': {
                    if (order.status === 'pending') {
                        console.warn(`[Stripe Webhook] payment_intent.succeeded received but order ${orderId} is still pending. Manual capture might have been bypassed.`);
                        await this.ordersRepo.updateWebhookEventStatus(event.id, 'ignored', 'Order is pending on succeeded event');
                    }
                    else {
                        console.log(`[Stripe Webhook] Order ${orderId} payment succeeded`);
                        await this.ordersRepo.updateWebhookEventStatus(event.id, 'success');
                    }
                    break;
                }
                case 'payment_intent.payment_failed': {
                    if (order.status === 'pending') {
                        await this.ordersRepo.updateStatus(orderId, 'failed');
                        console.log(`[Stripe Webhook] Order ${orderId} marked as failed.`);
                        await this.ordersRepo.updateWebhookEventStatus(event.id, 'success');
                    }
                    else {
                        console.log(`[Stripe Webhook] Order ${orderId} is already ${order.status}, ignoring failed event`);
                        await this.ordersRepo.updateWebhookEventStatus(event.id, 'ignored', `Order already ${order.status}`);
                    }
                    break;
                }
                case 'payment_intent.canceled': {
                    if (order.status === 'pending') {
                        await this.ordersRepo.updateStatus(orderId, 'cancelled');
                        console.log(`[Stripe Webhook] Order ${orderId} marked as cancelled.`);
                        await this.ordersRepo.updateWebhookEventStatus(event.id, 'success');
                    }
                    else {
                        console.log(`[Stripe Webhook] Order ${orderId} is already ${order.status}, ignoring canceled event`);
                        await this.ordersRepo.updateWebhookEventStatus(event.id, 'ignored', `Order already ${order.status}`);
                    }
                    break;
                }
                default: {
                    await this.ordersRepo.updateWebhookEventStatus(event.id, 'ignored');
                    break;
                }
            }
        }
        catch (error) {
            const msg = getErrorMessage(error);
            console.error(`[Stripe Webhook] Processing failed for ${event.id}:`, msg);
            await this.ordersRepo.updateWebhookEventStatus(event.id, 'failed', msg);
        }
        return { received: true };
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(supabase_user_guard_1.SupabaseUserGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getMyOrders", null);
__decorate([
    (0, common_1.Get)('status/:orderNumber'),
    __param(0, (0, common_1.Param)('orderNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getOrderStatus", null);
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
    (0, common_1.Post)('stripe/cancel'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [cancel_stripe_order_dto_1.CancelStripeOrderDto]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "cancelStripeOrder", null);
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
        cancel_stripe_order_use_case_1.CancelStripeOrderUseCase,
        get_order_status_use_case_1.GetOrderStatusUseCase,
        get_user_orders_use_case_1.GetUserOrdersUseCase,
        stripe_service_1.StripeService,
        orders_repository_1.OrdersRepository])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map
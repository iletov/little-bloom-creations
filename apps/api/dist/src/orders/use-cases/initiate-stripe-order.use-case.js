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
exports.InitiateStripeOrderUseCase = void 0;
const common_1 = require("@nestjs/common");
const orders_repository_1 = require("../repositories/orders.repository");
const stripe_service_1 = require("../../stripe/stripe.service");
let InitiateStripeOrderUseCase = class InitiateStripeOrderUseCase {
    ordersRepo;
    stripeService;
    constructor(ordersRepo, stripeService) {
        this.ordersRepo = ordersRepo;
        this.stripeService = stripeService;
    }
    async execute(dto) {
        try {
            const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            const subtotal = dto.items.reduce((sum, item) => {
                return sum + item.unitPrice * item.quantity;
            }, 0);
            const deliveryCost = dto.deliveryCost;
            const totalAmount = subtotal + deliveryCost;
            const orderData = {
                orderNumber,
                status: 'pending',
                totalAmount: totalAmount.toFixed(2),
                subtotal: subtotal.toFixed(2),
                deliveryCost: deliveryCost.toFixed(2),
                deliveryMethod: dto.deliveryMethod,
                paymentMethod: 'stripe',
            };
            const shippingData = {
                orderId: '',
                fullName: `${dto.recipientInfo.firstName} ${dto.recipientInfo.lastName}`,
                email: dto.recipientInfo.email || '',
                phone: dto.recipientInfo.phone,
                country: dto.recipientAddress.country || 'BG',
                city: dto.recipientAddress.city,
                postalCode: dto.recipientAddress.postalCode || '',
                street: dto.recipientAddress.street || null,
                streetNumber: dto.recipientAddress.streetNumber || null,
                officeCode: dto.recipientInfo.officeId || null,
            };
            const itemsData = dto.items.map((item) => ({
                orderId: '',
                productId: item.productId,
                variantId: item.variantId || null,
                name: item.name,
                variantName: item.variantName || null,
                quantity: item.quantity,
                unitPrice: item.unitPrice.toString(),
                subtotal: (item.unitPrice * item.quantity).toString(),
                weight: item.weight.toString(),
                personalization: item.personalization || null,
            }));
            const orderId = await this.ordersRepo.createFullOrder(orderData, shippingData, itemsData);
            const paymentIntent = await this.stripeService.createPaymentIntent(totalAmount, {
                orderId: orderId,
                orderNumber: orderNumber,
            }, dto.recipientInfo.email);
            await this.ordersRepo.savePaymentIntent(orderId, paymentIntent.id);
            return {
                orderNumber,
                clientSecret: paymentIntent.client_secret ?? undefined,
                paymentIntentId: paymentIntent.id,
            };
        }
        catch (error) {
            console.error('Error initiating Stripe order:', error);
            throw new common_1.InternalServerErrorException('Failed to initiate order');
        }
    }
};
exports.InitiateStripeOrderUseCase = InitiateStripeOrderUseCase;
exports.InitiateStripeOrderUseCase = InitiateStripeOrderUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [orders_repository_1.OrdersRepository,
        stripe_service_1.StripeService])
], InitiateStripeOrderUseCase);
//# sourceMappingURL=initiate-stripe-order.use-case.js.map
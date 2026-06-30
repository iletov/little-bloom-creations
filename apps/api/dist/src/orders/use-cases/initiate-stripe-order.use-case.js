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
const products_repository_1 = require("../../products/products.repository");
let InitiateStripeOrderUseCase = class InitiateStripeOrderUseCase {
    ordersRepo;
    stripeService;
    productsRepo;
    constructor(ordersRepo, stripeService, productsRepo) {
        this.ordersRepo = ordersRepo;
        this.stripeService = stripeService;
        this.productsRepo = productsRepo;
    }
    async execute(dto) {
        try {
            const subtotal = dto.items.reduce((sum, item) => {
                return sum + item.unitPrice * item.quantity;
            }, 0);
            const deliveryCost = dto.deliveryCost;
            const totalAmount = subtotal + deliveryCost;
            const reusablePayment = await this.findReusablePayment(dto, totalAmount);
            if (reusablePayment) {
                return reusablePayment;
            }
            const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
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
                additionalInfo: dto.recipientInfo.officeName || null,
            };
            const itemsData = [];
            for (const item of dto.items) {
                if (!item.sku || item.sku === 'N/A') {
                    throw new common_1.InternalServerErrorException(`Item ${item.name} is missing SKU`);
                }
                const product = await this.productsRepo.findBySku(item.sku);
                if (!product) {
                    throw new common_1.InternalServerErrorException(`Product with SKU ${item.sku} not found in database`);
                }
                let variantId = null;
                if (item.variantSku && product.variants) {
                    const variant = product.variants.find((v) => v.variant_sku === item.variantSku || v.variantSku === item.variantSku);
                    if (variant) {
                        variantId = variant.id;
                    }
                }
                itemsData.push({
                    orderId: '',
                    productId: product.id,
                    variantId: variantId,
                    name: item.name,
                    variantName: item.variantName || null,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice.toString(),
                    subtotal: (item.unitPrice * item.quantity).toString(),
                    weight: item.weight.toString(),
                    personalization: item.personalization || null,
                });
            }
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
    async findReusablePayment(dto, totalAmount) {
        if (!dto.existingOrderNumber || !dto.existingPaymentIntentId) {
            return null;
        }
        const existingOrder = await this.ordersRepo.findByOrderNumber(dto.existingOrderNumber);
        if (!existingOrder ||
            existingOrder.status !== 'pending' ||
            existingOrder.stripePaymentIntentId !== dto.existingPaymentIntentId) {
            return null;
        }
        const hasSameCheckoutTerms = Number(existingOrder.totalAmount) === Number(totalAmount.toFixed(2)) &&
            existingOrder.deliveryMethod === dto.deliveryMethod;
        if (!hasSameCheckoutTerms) {
            await this.stripeService.cancelPayment(dto.existingPaymentIntentId, 'Checkout details changed');
            await this.ordersRepo.updateStatus(existingOrder.id, 'cancelled');
            return null;
        }
        const paymentIntent = await this.stripeService.retrievePaymentIntent(dto.existingPaymentIntentId);
        const reusableStatuses = new Set([
            'requires_payment_method',
            'requires_confirmation',
            'requires_action',
            'requires_capture',
            'processing',
            'succeeded',
        ]);
        if (!reusableStatuses.has(paymentIntent.status)) {
            if (paymentIntent.status === 'canceled') {
                await this.ordersRepo.updateStatus(existingOrder.id, 'cancelled');
            }
            return null;
        }
        return {
            orderNumber: existingOrder.orderNumber,
            clientSecret: paymentIntent.client_secret ?? undefined,
            paymentIntentId: paymentIntent.id,
        };
    }
};
exports.InitiateStripeOrderUseCase = InitiateStripeOrderUseCase;
exports.InitiateStripeOrderUseCase = InitiateStripeOrderUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [orders_repository_1.OrdersRepository,
        stripe_service_1.StripeService,
        products_repository_1.ProductsRepository])
], InitiateStripeOrderUseCase);
//# sourceMappingURL=initiate-stripe-order.use-case.js.map
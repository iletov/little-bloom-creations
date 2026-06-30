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
exports.PlaceCashOrderUseCase = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const orders_repository_1 = require("../repositories/orders.repository");
const shared_types_1 = require("@repo/shared-types");
const products_repository_1 = require("../../products/products.repository");
const transaction_manager_1 = require("../../database/transaction.manager");
let PlaceCashOrderUseCase = class PlaceCashOrderUseCase {
    ordersRepo;
    productsRepo;
    constructor(ordersRepo, productsRepo) {
        this.ordersRepo = ordersRepo;
        this.productsRepo = productsRepo;
    }
    async execute(dto) {
        return transaction_manager_1.TransactionManager.runInTransaction(async () => {
            const orderId = (0, uuid_1.v4)();
            const orderNumber = `LBC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            const subtotal = dto.totalAmount - dto.deliveryCost;
            for (const item of dto.items) {
                await this.productsRepo.decreaseStockSafely(item.sku, item.quantity);
            }
            const orderData = {
                id: orderId,
                orderNumber,
                status: 'confirmed',
                totalAmount: dto.totalAmount.toString(),
                subtotal: subtotal.toString(),
                deliveryCost: dto.deliveryCost.toString(),
                deliveryMethod: dto.deliveryMethod,
                paymentMethod: shared_types_1.PaymentMethodEnum.CASH,
                shipmentNumber: null,
            };
            const shippingData = {
                id: (0, uuid_1.v4)(),
                orderId,
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
                    throw new common_1.BadRequestException(`Item ${item.name} is missing SKU`);
                }
                const product = await this.productsRepo.findBySku(item.sku);
                if (!product) {
                    throw new common_1.BadRequestException(`Product with SKU ${item.sku} not found in database`);
                }
                let variantId = null;
                if (item.variantSku && product.variants) {
                    const variant = product.variants.find((v) => v.variant_sku === item.variantSku || v.variantSku === item.variantSku);
                    if (variant) {
                        variantId = variant.id;
                    }
                }
                itemsData.push({
                    id: (0, uuid_1.v4)(),
                    orderId,
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
            await this.ordersRepo.createFullOrder(orderData, shippingData, itemsData);
            return { orderNumber };
        });
    }
};
exports.PlaceCashOrderUseCase = PlaceCashOrderUseCase;
exports.PlaceCashOrderUseCase = PlaceCashOrderUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [orders_repository_1.OrdersRepository,
        products_repository_1.ProductsRepository])
], PlaceCashOrderUseCase);
//# sourceMappingURL=place-cash-order.use-case.js.map
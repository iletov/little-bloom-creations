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
exports.GetUserOrdersUseCase = void 0;
const common_1 = require("@nestjs/common");
const orders_repository_1 = require("../repositories/orders.repository");
let GetUserOrdersUseCase = class GetUserOrdersUseCase {
    ordersRepository;
    constructor(ordersRepository) {
        this.ordersRepository = ordersRepository;
    }
    async execute(email) {
        if (!email) {
            return [];
        }
        const orders = await this.ordersRepository.findOrdersByEmail(email);
        return orders.map(o => ({
            id: o.id,
            order_number: o.orderNumber,
            created_at: o.createdAt,
            status: o.status,
            total_amount: Number(o.totalAmount),
            subtotal: Number(o.subtotal),
            delivery_cost: Number(o.deliveryCost),
            delivery_method: o.deliveryMethod,
            payment_method: o.paymentMethod,
            shipment_number: o.shipmentNumber,
            order_shipping: o.shipping ? {
                id: o.shipping.id,
                full_name: o.shipping.fullName,
                email: o.shipping.email,
                phone: o.shipping.phone,
                country: o.shipping.country,
                city: o.shipping.city,
                postal_code: o.shipping.postalCode,
                street: o.shipping.street,
                street_number: o.shipping.streetNumber,
                office_code: o.shipping.officeCode,
                additional_info: o.shipping.additionalInfo,
            } : null,
            order_items: o.items?.map(i => ({
                id: i.id,
                name: i.name,
                quantity: i.quantity,
                unit_price: Number(i.unitPrice),
                subtotal: Number(i.subtotal),
                weight: i.weight,
                product_sku: i.productId,
                variant_name: i.variantName,
            }))
        }));
    }
};
exports.GetUserOrdersUseCase = GetUserOrdersUseCase;
exports.GetUserOrdersUseCase = GetUserOrdersUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [orders_repository_1.OrdersRepository])
], GetUserOrdersUseCase);
//# sourceMappingURL=get-user-orders.use-case.js.map
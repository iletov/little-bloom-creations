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
exports.AdminOrdersService = void 0;
const common_1 = require("@nestjs/common");
const admin_repository_1 = require("./admin.repository");
let AdminOrdersService = class AdminOrdersService {
    adminRepository;
    constructor(adminRepository) {
        this.adminRepository = adminRepository;
    }
    transformOrder(order) {
        return {
            ...order,
            delivery_method: order.deliveryMethod?.includes('office') ||
                order.deliveryMethod?.includes('pickup')
                ? 'office'
                : 'delivery',
            delivery_company: order.deliveryMethod?.startsWith('ekont')
                ? 'ekont'
                : 'speedy',
        };
    }
    async getAllOrders() {
        const allOrdersData = await this.adminRepository.getAllOrdersWithBasicShipping();
        const mappedOrders = allOrdersData.map(o => {
            const transformed = this.transformOrder(o);
            return {
                ...transformed,
                order_number: o.orderNumber,
                created_at: o.createdAt,
                status: o.status,
                delivery_method: transformed.delivery_method,
                payment_method: o.paymentMethod,
                delivery_cost: Number(o.deliveryCost),
                total_amount: Number(o.totalAmount),
                subtotal: Number(o.subtotal),
                shipment_number: o.shipmentNumber,
                order_shipping: o.shipping ? {
                    full_name: o.shipping.fullName,
                    email: o.shipping.email,
                } : null,
            };
        });
        const recentOrders = mappedOrders.slice(0, 10);
        return {
            allOrders: mappedOrders,
            recentOrders,
        };
    }
    async getSingleOrder(orderNumber) {
        const orderData = await this.adminRepository.getOrderByNumber(orderNumber);
        if (!orderData) {
            throw new common_1.NotFoundException(`Order ${orderNumber} not found`);
        }
        const transformed = this.transformOrder(orderData);
        return {
            ...transformed,
            order_number: orderData.orderNumber,
            created_at: orderData.createdAt,
            status: orderData.status,
            delivery_method: transformed.delivery_method,
            payment_method: orderData.paymentMethod,
            delivery_cost: Number(orderData.deliveryCost),
            total_amount: Number(orderData.totalAmount),
            subtotal: Number(orderData.subtotal),
            shipment_number: orderData.shipmentNumber,
            order_shipping: orderData.shipping ? {
                full_name: orderData.shipping.fullName,
                email: orderData.shipping.email,
                phone: orderData.shipping.phone,
                country: orderData.shipping.country,
                city: orderData.shipping.city,
                postal_code: orderData.shipping.postalCode,
                street: orderData.shipping.street,
                street_number: orderData.shipping.streetNumber,
                office_code: orderData.shipping.officeCode,
                additional_info: orderData.shipping.additionalInfo,
            } : null,
            order_items: orderData.items?.map(i => ({
                id: i.id,
                name: i.name,
                product_sku: i.product?.sku || 'N/A',
                variant_name: i.variantName,
                quantity: i.quantity,
                unit_price: Number(i.unitPrice),
                subtotal: Number(i.subtotal),
                weight: Number(i.weight) || Number(i.product?.weight) || 0,
                personalization: i.personalization,
                dimensions: {
                    width: Number(i.product?.width) || 0,
                    height: Number(i.product?.height) || 0,
                    depth: Number(i.product?.depth) || 0,
                }
            }))
        };
    }
    async updateOrder(orderId, updates) {
        const dbUpdates = {};
        for (const [key, value] of Object.entries(updates)) {
            if (key === 'status')
                dbUpdates.status = value;
        }
        if (Object.keys(dbUpdates).length === 0) {
            Object.assign(dbUpdates, updates);
        }
        return this.adminRepository.updateOrder(orderId, dbUpdates);
    }
};
exports.AdminOrdersService = AdminOrdersService;
exports.AdminOrdersService = AdminOrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [admin_repository_1.AdminRepository])
], AdminOrdersService);
//# sourceMappingURL=admin-orders.service.js.map
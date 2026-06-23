import { MetricsService } from './metrics.service';
import { AdminOrdersService } from './admin-orders.service';
import { AdminWaybillService } from './admin-waybill.service';
import { AdminCancellationService } from './admin-cancellation.service';
export declare class AdminController {
    private readonly metricsService;
    private readonly adminOrdersService;
    private readonly adminWaybillService;
    private readonly adminCancellationService;
    constructor(metricsService: MetricsService, adminOrdersService: AdminOrdersService, adminWaybillService: AdminWaybillService, adminCancellationService: AdminCancellationService);
    getMetrics(days?: string): Promise<{
        todayRevenue: string;
        todayOrdersCount: number;
        pendingOrdersCount: number;
        productsCount: number;
        allRevenue: string;
        chartData: {
            date: string;
            revenue: number;
        }[];
        deliveryChartData: {
            name: string;
            count: number;
            fill: string;
        }[];
    }>;
    getAllOrders(): Promise<{
        allOrders: {
            order_number: string;
            created_at: Date;
            status: "pending" | "confirmed" | "shipped" | "delivered" | "refunded" | "cancelled";
            delivery_method: string;
            payment_method: import("@repo/shared-types").PaymentMethodEnum;
            delivery_cost: number;
            total_amount: number;
            subtotal: number;
            shipment_number: string | null;
            order_shipping: {
                full_name: unknown;
                email: unknown;
            } | null;
            delivery_company: string;
            id: string;
            orderNumber: string;
            createdAt: Date;
            totalAmount: string;
            deliveryCost: string;
            deliveryMethod: import("@repo/shared-types").DeliveryMethodEnum;
            paymentMethod: import("@repo/shared-types").PaymentMethodEnum;
            shipmentNumber: string | null;
            stripePaymentIntentId: string | null;
            shipping?: Record<string, unknown> | null;
            items?: Record<string, unknown>[];
        }[];
        recentOrders: {
            order_number: string;
            created_at: Date;
            status: "pending" | "confirmed" | "shipped" | "delivered" | "refunded" | "cancelled";
            delivery_method: string;
            payment_method: import("@repo/shared-types").PaymentMethodEnum;
            delivery_cost: number;
            total_amount: number;
            subtotal: number;
            shipment_number: string | null;
            order_shipping: {
                full_name: unknown;
                email: unknown;
            } | null;
            delivery_company: string;
            id: string;
            orderNumber: string;
            createdAt: Date;
            totalAmount: string;
            deliveryCost: string;
            deliveryMethod: import("@repo/shared-types").DeliveryMethodEnum;
            paymentMethod: import("@repo/shared-types").PaymentMethodEnum;
            shipmentNumber: string | null;
            stripePaymentIntentId: string | null;
            shipping?: Record<string, unknown> | null;
            items?: Record<string, unknown>[];
        }[];
    }>;
    getSingleOrder(orderNumber: string): Promise<{
        order_number: string;
        created_at: Date;
        status: "pending" | "confirmed" | "shipped" | "delivered" | "refunded" | "cancelled";
        delivery_method: string;
        payment_method: import("@repo/shared-types").PaymentMethodEnum;
        delivery_cost: number;
        total_amount: number;
        subtotal: number;
        shipment_number: string | null;
        order_shipping: {
            full_name: string;
            email: string;
            phone: string;
            country: string;
            city: string;
            postal_code: string;
            street: string | null;
            street_number: string | null;
            office_code: string | null;
            additional_info: string | null;
        } | null;
        order_items: {
            id: string;
            name: string;
            product_sku: any;
            variant_name: string | null;
            quantity: number;
            unit_price: number;
            subtotal: number;
            weight: number;
            personalization: unknown;
            dimensions: {
                width: number;
                height: number;
                depth: number;
            };
        }[];
        delivery_company: string;
        id: string;
        orderNumber: string;
        createdAt: Date;
        totalAmount: string;
        deliveryCost: string;
        deliveryMethod: import("@repo/shared-types").DeliveryMethodEnum;
        paymentMethod: import("@repo/shared-types").PaymentMethodEnum;
        shipmentNumber: string | null;
        stripePaymentIntentId: string | null;
        shipping?: Record<string, unknown> | null;
        items?: Record<string, unknown>[];
    }>;
    updateOrder(id: string, updates: Record<string, unknown>): Promise<{
        id: string;
        orderNumber: string;
        createdAt: Date;
        status: "pending" | "confirmed" | "shipped" | "delivered" | "refunded" | "cancelled";
        totalAmount: string;
        subtotal: string;
        deliveryCost: string;
        deliveryMethod: import("@repo/shared-types").DeliveryMethodEnum;
        paymentMethod: import("@repo/shared-types").PaymentMethodEnum;
        shipmentNumber: string | null;
        stripePaymentIntentId: string | null;
    }>;
    generateWaybill(id: string): Promise<{
        success: boolean;
        shipmentNumber: string | null;
        shipmentData: any;
    }>;
    cancelOrder(id: string): Promise<{
        success: boolean;
        message: string;
        order: {
            id: string;
            orderNumber: string;
            createdAt: Date;
            status: "pending" | "confirmed" | "shipped" | "delivered" | "refunded" | "cancelled";
            totalAmount: string;
            subtotal: string;
            deliveryCost: string;
            deliveryMethod: import("@repo/shared-types").DeliveryMethodEnum;
            paymentMethod: import("@repo/shared-types").PaymentMethodEnum;
            shipmentNumber: string | null;
            stripePaymentIntentId: string | null;
        };
    }>;
    markAsDelivered(id: string): Promise<{
        success: boolean;
        status: string;
    }>;
}

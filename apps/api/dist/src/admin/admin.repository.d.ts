export declare class AdminRepository {
    getMetrics(chartStartDate: Date, days: number): Promise<{
        todayStats: {
            revenue: number;
            count: number;
        };
        allStats: {
            revenue: number;
        };
        pendingStats: {
            count: number;
        };
        productsCountResult: {
            count: number;
        };
        variantsCountResult: {
            count: number;
        };
        chartStats: {
            date: string;
            revenue: number;
        }[];
        deliveryStats: {
            method: import("@repo/shared-types").DeliveryMethodEnum;
            count: number;
        }[];
    }>;
    getAllOrdersWithBasicShipping(): Promise<{
        id: string;
        orderNumber: string;
        createdAt: Date;
        status: "pending" | "confirmed" | "shipped" | "refunded" | "cancelled";
        totalAmount: string;
        subtotal: string;
        deliveryCost: string;
        deliveryMethod: import("@repo/shared-types").DeliveryMethodEnum;
        paymentMethod: import("@repo/shared-types").PaymentMethodEnum;
        shipmentNumber: string | null;
        stripePaymentIntentId: string | null;
        shipping: {
            fullName: string;
            email: string;
        };
    }[]>;
    getOrderByNumber(orderNumberOrId: string): Promise<{
        id: string;
        orderNumber: string;
        createdAt: Date;
        status: "pending" | "confirmed" | "shipped" | "refunded" | "cancelled";
        totalAmount: string;
        subtotal: string;
        deliveryCost: string;
        deliveryMethod: import("@repo/shared-types").DeliveryMethodEnum;
        paymentMethod: import("@repo/shared-types").PaymentMethodEnum;
        shipmentNumber: string | null;
        stripePaymentIntentId: string | null;
        shipping: {
            id: string;
            orderId: string;
            fullName: string;
            email: string;
            phone: string;
            country: string;
            city: string;
            postalCode: string;
            street: string | null;
            streetNumber: string | null;
            blockNo: string | null;
            entranceNo: string | null;
            floorNo: string | null;
            apartmentNo: string | null;
            officeCode: string | null;
            additionalInfo: string | null;
        };
        items: {
            id: string;
            name: string;
            weight: string;
            variantName: string | null;
            subtotal: string;
            orderId: string;
            productId: string;
            variantId: string | null;
            quantity: number;
            unitPrice: string;
            personalization: unknown;
            product: {
                id: string;
                name: string;
                sku: string;
                price: string;
                discount: string | null;
                weight: string | null;
                width: string | null;
                height: string | null;
                length: string | null;
                depth: string | null;
                currentStock: number;
                isActive: boolean;
            };
        }[];
    } | undefined>;
    updateOrder(orderId: string, dbUpdates: Record<string, unknown>): Promise<{
        id: string;
        orderNumber: string;
        createdAt: Date;
        status: "pending" | "confirmed" | "shipped" | "refunded" | "cancelled";
        totalAmount: string;
        subtotal: string;
        deliveryCost: string;
        deliveryMethod: import("@repo/shared-types").DeliveryMethodEnum;
        paymentMethod: import("@repo/shared-types").PaymentMethodEnum;
        shipmentNumber: string | null;
        stripePaymentIntentId: string | null;
    }>;
    getOrderWithShipping(orderId: string): Promise<{
        id: string;
        orderNumber: string;
        createdAt: Date;
        status: "pending" | "confirmed" | "shipped" | "refunded" | "cancelled";
        totalAmount: string;
        subtotal: string;
        deliveryCost: string;
        deliveryMethod: import("@repo/shared-types").DeliveryMethodEnum;
        paymentMethod: import("@repo/shared-types").PaymentMethodEnum;
        shipmentNumber: string | null;
        stripePaymentIntentId: string | null;
        shipping: {
            id: string;
            orderId: string;
            fullName: string;
            email: string;
            phone: string;
            country: string;
            city: string;
            postalCode: string;
            street: string | null;
            streetNumber: string | null;
            blockNo: string | null;
            entranceNo: string | null;
            floorNo: string | null;
            apartmentNo: string | null;
            officeCode: string | null;
            additionalInfo: string | null;
        };
    } | undefined>;
    saveWaybill(orderId: string, shipmentNumber: string, deliveryCost?: string): Promise<void>;
    getOrderWithItems(orderId: string): Promise<{
        id: string;
        orderNumber: string;
        createdAt: Date;
        status: "pending" | "confirmed" | "shipped" | "refunded" | "cancelled";
        totalAmount: string;
        subtotal: string;
        deliveryCost: string;
        deliveryMethod: import("@repo/shared-types").DeliveryMethodEnum;
        paymentMethod: import("@repo/shared-types").PaymentMethodEnum;
        shipmentNumber: string | null;
        stripePaymentIntentId: string | null;
        items: {
            id: string;
            name: string;
            weight: string;
            variantName: string | null;
            subtotal: string;
            orderId: string;
            productId: string;
            variantId: string | null;
            quantity: number;
            unitPrice: string;
            personalization: unknown;
        }[];
    } | undefined>;
    cancelOrderAndRestoreStock(orderId: string, items: any[]): Promise<{
        id: string;
        orderNumber: string;
        createdAt: Date;
        status: "pending" | "confirmed" | "shipped" | "refunded" | "cancelled";
        totalAmount: string;
        subtotal: string;
        deliveryCost: string;
        deliveryMethod: import("@repo/shared-types").DeliveryMethodEnum;
        paymentMethod: import("@repo/shared-types").PaymentMethodEnum;
        shipmentNumber: string | null;
        stripePaymentIntentId: string | null;
    }>;
}

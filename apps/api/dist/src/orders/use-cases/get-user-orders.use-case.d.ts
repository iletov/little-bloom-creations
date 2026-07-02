import { OrdersRepository } from '../repositories/orders.repository';
export declare class GetUserOrdersUseCase {
    private readonly ordersRepository;
    constructor(ordersRepository: OrdersRepository);
    execute(email: string): Promise<{
        id: string;
        order_number: string;
        created_at: Date;
        status: "pending" | "confirmed" | "failed" | "shipped" | "delivered" | "refunded" | "cancelled";
        total_amount: number;
        subtotal: number;
        delivery_cost: number;
        delivery_method: import("@repo/shared-types").DeliveryMethodEnum;
        payment_method: import("@repo/shared-types").PaymentMethodEnum;
        shipment_number: string | null;
        order_shipping: {
            id: string;
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
            quantity: number;
            unit_price: number;
            subtotal: number;
            weight: string;
            product_sku: string;
            variant_name: string | null;
        }[];
    }[]>;
}

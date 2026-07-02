import { OrdersRepository } from '../repositories/orders.repository';
export declare class GetOrderStatusUseCase {
    private readonly ordersRepo;
    constructor(ordersRepo: OrdersRepository);
    execute(orderNumber: string): Promise<{
        status: string;
        order: {
            id: string;
            total_amount: string;
            created_at: Date;
            order_number: string;
            payment_method: import("@repo/shared-types").PaymentMethodEnum;
        };
        order_number: string;
        message: string;
    }>;
}

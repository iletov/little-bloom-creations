import { OrdersRepository } from '../repositories/orders.repository';
export declare class GetOrderStatusUseCase {
    private readonly ordersRepo;
    constructor(ordersRepo: OrdersRepository);
    execute(orderNumber: string): Promise<{
        status: string;
        order: {
            id: any;
            total_amount: any;
            created_at: any;
            order_number: any;
        };
        order_number: any;
        message: string;
    }>;
}

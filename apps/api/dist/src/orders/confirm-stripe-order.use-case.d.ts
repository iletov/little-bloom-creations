import { OrdersRepository } from './repositories/orders.repository';
export declare class ConfirmStripeOrderUseCase {
    private readonly ordersRepo;
    constructor(ordersRepo: OrdersRepository);
    execute(orderId: string, paymentIntentId: string): Promise<void>;
}

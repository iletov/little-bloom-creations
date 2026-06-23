import { OrdersRepository } from '../repositories/orders.repository';
export declare class GetUserOrdersUseCase {
    private readonly ordersRepository;
    constructor(ordersRepository: OrdersRepository);
    execute(email: string): Promise<any>;
}

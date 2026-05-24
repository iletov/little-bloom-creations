import { OrdersRepository } from '../repositories/orders.repository';
import { PlaceCashOrderDto } from '../dto/place-cash-order.dto';
import { Order } from '@repo/shared-types';
export declare class PlaceCashOrderUseCase {
    private readonly ordersRepository;
    constructor(ordersRepository: OrdersRepository);
    execute(dto: PlaceCashOrderDto): Promise<Order>;
}

import { PlaceCashOrderUseCase } from './use-cases/place-cash-order.use-case';
import { PlaceCashOrderDto } from './dto/place-cash-order.dto';
import { Order } from '@repo/shared-types';
export declare class OrdersController {
    private readonly placeCashOrderUseCase;
    constructor(placeCashOrderUseCase: PlaceCashOrderUseCase);
    placeCashOrder(dto: PlaceCashOrderDto): Promise<Order>;
}

import { PlaceCashOrderUseCase } from './use-cases/place-cash-order.use-case';
import { PlaceCashOrderDto } from './dto/place-cash-order.dto';
export interface PlaceOrderResponse {
    orderNumber: string;
}
export declare class OrdersController {
    private readonly placeCashOrderUseCase;
    constructor(placeCashOrderUseCase: PlaceCashOrderUseCase);
    placeCashOrder(dto: PlaceCashOrderDto): Promise<PlaceOrderResponse>;
}

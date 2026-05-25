import { OrdersRepository } from '../repositories/orders.repository';
import { PlaceCashOrderDto } from '../dto/place-cash-order.dto';
import { PlaceOrderResponse } from '../orders.controller';
import { ProductsRepository } from "../../products/products.repository";
export declare class PlaceCashOrderUseCase {
    private readonly ordersRepo;
    private readonly productsRepo;
    constructor(ordersRepo: OrdersRepository, productsRepo: ProductsRepository);
    execute(dto: PlaceCashOrderDto): Promise<PlaceOrderResponse>;
}

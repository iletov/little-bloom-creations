import { OrdersRepository } from '../repositories/orders.repository';
import { StripeService } from '../../stripe/stripe.service';
import { PlaceStripeOrderDto } from '../dto/place-stripe-order.dto';
import { ProductsRepository } from '../../products/products.repository';
interface InitiateStripeOrderResult {
    orderNumber: string;
    clientSecret?: string;
    paymentIntentId: string;
}
export declare class InitiateStripeOrderUseCase {
    private readonly ordersRepo;
    private readonly stripeService;
    private readonly productsRepo;
    constructor(ordersRepo: OrdersRepository, stripeService: StripeService, productsRepo: ProductsRepository);
    execute(dto: PlaceStripeOrderDto): Promise<InitiateStripeOrderResult>;
    private findReusablePayment;
}
export {};

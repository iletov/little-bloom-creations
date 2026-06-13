import { OrdersRepository } from '../repositories/orders.repository';
import { StripeService } from '../../stripe/stripe.service';
import { PlaceStripeOrderDto } from '../dto/place-stripe-order.dto';
import { ProductsRepository } from '../../products/products.repository';
export declare class InitiateStripeOrderUseCase {
    private readonly ordersRepo;
    private readonly stripeService;
    private readonly productsRepo;
    constructor(ordersRepo: OrdersRepository, stripeService: StripeService, productsRepo: ProductsRepository);
    execute(dto: PlaceStripeOrderDto): Promise<{
        orderNumber: string;
        clientSecret: string | undefined;
        paymentIntentId: string;
    }>;
}

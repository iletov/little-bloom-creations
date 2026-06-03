import { OrdersRepository } from '../repositories/orders.repository';
import { ProductsRepository } from '../../products/products.repository';
import { StripeService } from '../../stripe/stripe.service';
export declare class ConfirmStripeOrderUseCase {
    private readonly ordersRepo;
    private readonly productsRepo;
    private readonly stripeService;
    private readonly logger;
    constructor(ordersRepo: OrdersRepository, productsRepo: ProductsRepository, stripeService: StripeService);
    execute(orderId: string, paymentIntentId: string): Promise<void>;
}

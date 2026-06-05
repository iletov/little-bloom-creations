import { OrdersRepository } from '../repositories/orders.repository';
import { StripeService } from '../../stripe/stripe.service';
import { PlaceStripeOrderDto } from '../dto/place-stripe-order.dto';
export declare class InitiateStripeOrderUseCase {
    private readonly ordersRepo;
    private readonly stripeService;
    constructor(ordersRepo: OrdersRepository, stripeService: StripeService);
    execute(dto: PlaceStripeOrderDto): Promise<{
        orderNumber: string;
        clientSecret: string | undefined;
        paymentIntentId: string;
    }>;
}

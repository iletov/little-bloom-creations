import { StripeService } from '../../stripe/stripe.service';
import { CancelStripeOrderDto } from '../dto/cancel-stripe-order.dto';
export declare class CancelStripeOrderUseCase {
    private readonly stripeService;
    constructor(stripeService: StripeService);
    execute(dto: CancelStripeOrderDto): Promise<import("stripe").Stripe.Response<import("stripe").Stripe.PaymentIntent>>;
}

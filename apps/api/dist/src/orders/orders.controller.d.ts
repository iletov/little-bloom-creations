import type { Request } from 'express';
import type { RawBodyRequest } from '@nestjs/common';
import { PlaceCashOrderUseCase } from './use-cases/place-cash-order.use-case';
import { PlaceCashOrderDto } from './dto/place-cash-order.dto';
import { InitiateStripeOrderUseCase } from './use-cases/initiate-stripe-order.use-case';
import { StripeService } from '../stripe/stripe.service';
import { PlaceStripeOrderDto } from './dto/place-stripe-order.dto';
import { ConfirmStripeOrderUseCase } from './use-cases/confirm-stripe-order.use-case';
export interface PlaceOrderResponse {
    orderNumber: string;
    clientSecret?: string;
    paymentIntentId?: string;
}
export declare class OrdersController {
    private readonly placeCashOrderUseCase;
    private readonly initiateStripeOrderUseCase;
    private readonly confirmStripeOrderUseCase;
    private readonly stripeService;
    constructor(placeCashOrderUseCase: PlaceCashOrderUseCase, initiateStripeOrderUseCase: InitiateStripeOrderUseCase, confirmStripeOrderUseCase: ConfirmStripeOrderUseCase, stripeService: StripeService);
    placeCashOrder(dto: PlaceCashOrderDto): Promise<PlaceOrderResponse>;
    initiateStripeOrder(dto: PlaceStripeOrderDto): Promise<PlaceOrderResponse>;
    handleStripeWebhook(req: RawBodyRequest<Request>, signature: string): Promise<{
        received: boolean;
    }>;
}

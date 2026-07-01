import type { Request } from 'express';
import type { RawBodyRequest } from '@nestjs/common';
import { PlaceCashOrderUseCase } from './use-cases/place-cash-order.use-case';
import { PlaceCashOrderDto } from './dto/place-cash-order.dto';
import { InitiateStripeOrderUseCase } from './use-cases/initiate-stripe-order.use-case';
import { StripeService } from '../stripe/stripe.service';
import { PlaceStripeOrderDto } from './dto/place-stripe-order.dto';
import Stripe from 'stripe';
import { ConfirmStripeOrderUseCase } from './use-cases/confirm-stripe-order.use-case';
import { CancelStripeOrderUseCase } from './use-cases/cancel-stripe-order.use-case';
import { CancelStripeOrderDto } from './dto/cancel-stripe-order.dto';
import { GetOrderStatusUseCase } from './use-cases/get-order-status.use-case';
import { GetUserOrdersUseCase } from './use-cases/get-user-orders.use-case';
import { OrdersRepository } from './repositories/orders.repository';
export interface PlaceOrderResponse {
    orderNumber: string;
    clientSecret?: string;
    paymentIntentId?: string;
}
export declare class OrdersController {
    private readonly placeCashOrderUseCase;
    private readonly initiateStripeOrderUseCase;
    private readonly confirmStripeOrderUseCase;
    private readonly cancelStripeOrderUseCase;
    private readonly getOrderStatusUseCase;
    private readonly getUserOrdersUseCase;
    private readonly stripeService;
    private readonly ordersRepo;
    constructor(placeCashOrderUseCase: PlaceCashOrderUseCase, initiateStripeOrderUseCase: InitiateStripeOrderUseCase, confirmStripeOrderUseCase: ConfirmStripeOrderUseCase, cancelStripeOrderUseCase: CancelStripeOrderUseCase, getOrderStatusUseCase: GetOrderStatusUseCase, getUserOrdersUseCase: GetUserOrdersUseCase, stripeService: StripeService, ordersRepo: OrdersRepository);
    getMyOrders(req: any): Promise<any>;
    getOrderStatus(orderNumber: string): Promise<{
        status: string;
        order: {
            id: any;
            total_amount: any;
            created_at: any;
            order_number: any;
            payment_method: any;
        };
        order_number: any;
        message: string;
    }>;
    placeCashOrder(dto: PlaceCashOrderDto): Promise<PlaceOrderResponse>;
    initiateStripeOrder(dto: PlaceStripeOrderDto): Promise<PlaceOrderResponse>;
    cancelStripeOrder(dto: CancelStripeOrderDto): Promise<Stripe.Response<Stripe.PaymentIntent>>;
    handleStripeWebhook(req: RawBodyRequest<Request>, signature: string): Promise<{
        received: boolean;
    }>;
}

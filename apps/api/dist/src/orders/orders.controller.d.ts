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
    getMyOrders(req: any): Promise<{
        id: string;
        order_number: string;
        created_at: Date;
        status: "pending" | "confirmed" | "failed" | "shipped" | "delivered" | "refunded" | "cancelled";
        total_amount: number;
        subtotal: number;
        delivery_cost: number;
        delivery_method: import("@repo/shared-types").DeliveryMethodEnum;
        payment_method: import("@repo/shared-types").PaymentMethodEnum;
        shipment_number: string | null;
        order_shipping: {
            id: string;
            full_name: string;
            email: string;
            phone: string;
            country: string;
            city: string;
            postal_code: string;
            street: string | null;
            street_number: string | null;
            office_code: string | null;
            additional_info: string | null;
        } | null;
        order_items: {
            id: string;
            name: string;
            quantity: number;
            unit_price: number;
            subtotal: number;
            weight: string;
            product_sku: string;
            variant_name: string | null;
        }[];
    }[]>;
    getOrderStatus(orderNumber: string): Promise<{
        status: string;
        order: {
            id: string;
            total_amount: string;
            created_at: Date;
            order_number: string;
            payment_method: import("@repo/shared-types").PaymentMethodEnum;
        };
        order_number: string;
        message: string;
    }>;
    placeCashOrder(dto: PlaceCashOrderDto): Promise<PlaceOrderResponse>;
    initiateStripeOrder(dto: PlaceStripeOrderDto): Promise<PlaceOrderResponse>;
    cancelStripeOrder(dto: CancelStripeOrderDto): Promise<Stripe.Response<Stripe.PaymentIntent>>;
    handleStripeWebhook(req: RawBodyRequest<Request>, signature: string): Promise<{
        received: boolean;
    }>;
}

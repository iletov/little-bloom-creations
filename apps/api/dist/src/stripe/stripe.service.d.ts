import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
export declare class StripeService {
    private readonly configService;
    private readonly stripe;
    private readonly webhookSecret;
    constructor(configService: ConfigService);
    createPaymentIntent(amount: number, metadata: Record<string, string>, email?: string): Promise<Stripe.Response<Stripe.PaymentIntent>>;
    constructEvent(payload: Buffer, signature: string): Stripe.Event;
    refundPayment(paymentIntentId: string, reason: string): Promise<Stripe.Response<Stripe.Refund>>;
    capturePayment(paymentIntentId: string): Promise<Stripe.Response<Stripe.PaymentIntent>>;
    cancelPayment(paymentIntentId: string, reason?: string): Promise<Stripe.Response<Stripe.PaymentIntent>>;
}

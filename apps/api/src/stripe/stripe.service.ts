import { Injectable, RawBodyRequest } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;
  private readonly webhookSecret: string;

  constructor(private readonly configService: ConfigService) {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY') || '';
    this.webhookSecret =
      this.configService.get<string>('STRIPE_WEBHOOK_SECRET') || '';

    if (!secretKey) {
      console.warn('STRIPE_SECRET_KEY missing in .env file!');
    }

    this.stripe = new Stripe(secretKey, {
      apiVersion: '2025-01-27.acacia',
    });
  }

  async createPaymentIntent(
    amount: number,
    metadata: Record<string, string>,
    email?: string,
  ): Promise<Stripe.PaymentIntent> {
    return this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'eur',
      automatic_payment_methods: { enabled: true },
      capture_method: 'manual', //Authorize only, no automatic capture
      metadata,
      receipt_email: email,
    });
  }

  async retrievePaymentIntent(
    paymentIntentId: string,
  ): Promise<Stripe.PaymentIntent> {
    return this.stripe.paymentIntents.retrieve(paymentIntentId);
  }

  // Критично за сигурността на Webhook-a
  constructEvent(payload: Buffer, signature: string): Stripe.Event {
    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      this.webhookSecret,
    );
  }

  async refundPayment(
    paymentIntentId: string,
    reason: string,
  ): Promise<Stripe.Response<Stripe.Refund>> {
    return this.stripe.refunds.create({
      payment_intent: paymentIntentId,
      metadata: { reason },
    });
  }

  async capturePayment(
    paymentIntentId: string,
  ): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    return this.stripe.paymentIntents.capture(paymentIntentId);
  }

  async cancelPayment(
    paymentIntentId: string,
    reason?: string,
  ): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    return this.stripe.paymentIntents.cancel(paymentIntentId);
  }
}

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
      console.warn('⚠️ ПРЕДУПРЕЖДЕНИЕ: STRIPE_SECRET_KEY липсва в .env файла!');
    }

    this.stripe = new Stripe(secretKey, {
      apiVersion: '2025-01-27.acacia',
    });
  }

  async createPaymentIntent(
    amount: number,
    metadata: Record<string, string>,
    email?: string,
  ) {
    return this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'eur',
      automatic_payment_methods: { enabled: true },
      metadata,
      receipt_email: email,
    });
  }

  // Критично за сигурността на Webhook-a
  constructEvent(payload: Buffer, signature: string): Stripe.Event {
    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      this.webhookSecret,
    );
  }

  async refundPayment(paymentIntentId: string, reason: string) {
    return this.stripe.refunds.create({
      payment_intent: paymentIntentId,
      metadata: { reason },
    });
  }
}

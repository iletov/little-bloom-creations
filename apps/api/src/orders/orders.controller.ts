import {
  Controller,
  Post,
  Body,
  Req,
  Headers,
  BadRequestException,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import type { RawBodyRequest } from '@nestjs/common'; // Оправя грешката с decorated signature
import { PlaceCashOrderUseCase } from './use-cases/place-cash-order.use-case';
import { PlaceCashOrderDto } from './dto/place-cash-order.dto';
import { InitiateStripeOrderUseCase } from './use-cases/initiate-stripe-order.use-case';
// Оправя липсващия импорт
import { StripeService } from '../stripe/stripe.service';
import { PlaceStripeOrderDto } from './dto/place-stripe-order.dto';
import Stripe from 'stripe';
import { ConfirmStripeOrderUseCase } from './use-cases/confirm-stripe-order.use-case';
import { CancelStripeOrderUseCase } from './use-cases/cancel-stripe-order.use-case';
import { CancelStripeOrderDto } from './dto/cancel-stripe-order.dto';
import { GetOrderStatusUseCase } from './use-cases/get-order-status.use-case';
import { GetUserOrdersUseCase } from './use-cases/get-user-orders.use-case';
import { SupabaseUserGuard } from '../common/guards/supabase-user.guard';
import { OrdersRepository } from './repositories/orders.repository';

export interface PlaceOrderResponse {
  orderNumber: string;
  clientSecret?: string;
  paymentIntentId?: string;
}

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly placeCashOrderUseCase: PlaceCashOrderUseCase,
    private readonly initiateStripeOrderUseCase: InitiateStripeOrderUseCase,
    private readonly confirmStripeOrderUseCase: ConfirmStripeOrderUseCase,
    private readonly cancelStripeOrderUseCase: CancelStripeOrderUseCase,
    private readonly getOrderStatusUseCase: GetOrderStatusUseCase,
    private readonly getUserOrdersUseCase: GetUserOrdersUseCase,
    private readonly stripeService: StripeService,
    private readonly ordersRepo: OrdersRepository,
  ) {}

  @Get('me')
  @UseGuards(SupabaseUserGuard)
  async getMyOrders(@Req() req: any) {
    const userEmail = req.user?.email;
    if (!userEmail) {
      throw new BadRequestException('User email not found in session');
    }
    return this.getUserOrdersUseCase.execute(userEmail);
  }

  @Get('status/:orderNumber')
  async getOrderStatus(@Param('orderNumber') orderNumber: string) {
    return this.getOrderStatusUseCase.execute(orderNumber);
  }

  @Post('cash')
  async placeCashOrder(
    @Body() dto: PlaceCashOrderDto,
  ): Promise<PlaceOrderResponse> {
    return this.placeCashOrderUseCase.execute(dto);
  }

  @Post('stripe/initiate')
  async initiateStripeOrder(
    @Body() dto: PlaceStripeOrderDto,
  ): Promise<PlaceOrderResponse> {
    const result = await this.initiateStripeOrderUseCase.execute(dto);

    // Оправя грешката "null is not assignable to string | undefined"
    return {
      orderNumber: result.orderNumber,
      clientSecret: result.clientSecret ?? undefined,
      paymentIntentId: result.paymentIntentId,
    };
  }

  @Post('stripe/cancel')
  async cancelStripeOrder(@Body() dto: CancelStripeOrderDto) {
    return this.cancelStripeOrderUseCase.execute(dto);
  }

  @Post('stripe/webhook')
  async handleStripeWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    if (!signature || !req.rawBody) {
      throw new BadRequestException('Missing signature or raw body');
    }

    let event: Stripe.Event;

    try {
      event = this.stripeService.constructEvent(req.rawBody, signature);
    } catch (err: any) {
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    // Check for duplicate event (idempotency)
    const existingEvent = await this.ordersRepo.findWebhookEventByStripeId(event.id);
    if (existingEvent) {
      console.log(`[Stripe Webhook] Skipping duplicate event ${event.id}`);
      return { received: true };
    }

    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const orderId = paymentIntent?.metadata?.orderId;
    const orderNumber = paymentIntent?.metadata?.orderNumber;

    // Log the initial event reception
    console.log(`[Stripe Webhook] Received ${event.type} for PaymentIntent ${paymentIntent?.id} (Order: ${orderId})`);

    // Insert initial pending event
    await this.ordersRepo.createWebhookEvent({
      stripeEventId: event.id,
      stripePaymentIntent: paymentIntent?.id || 'unknown',
      orderId: orderId || null,
      orderNumber: orderNumber || null,
      eventType: event.type,
      status: 'pending',
      payload: event,
    });

    if (!orderId) {
      console.log(`[Stripe Webhook] No orderId in metadata for event ${event.id}`);
      await this.ordersRepo.updateWebhookEventStatus(event.id, 'ignored', 'Missing orderId in metadata');
      return { received: true };
    }

    const order = await this.ordersRepo.findById(orderId);
    if (!order) {
      console.error(`[Stripe Webhook] Order ${orderId} not found for event ${event.id}`);
      await this.ordersRepo.updateWebhookEventStatus(event.id, 'ignored', 'Order not found');
      return { received: true };
    }

    try {
      switch (event.type) {
        case 'payment_intent.amount_capturable_updated': {
          if (['confirmed', 'cancelled', 'failed', 'refunded'].includes(order.status)) {
            console.log(`[Stripe Webhook] Order ${orderId} already ${order.status}, skipping fulfillment`);
            await this.ordersRepo.updateWebhookEventStatus(event.id, 'duplicate', `Order already ${order.status}`);
            break;
          }
          await this.confirmStripeOrderUseCase.execute(orderId, paymentIntent.id);
          await this.ordersRepo.updateWebhookEventStatus(event.id, 'success');
          console.log(`[Stripe Webhook] Order ${orderId} confirmed via capture.`);
          break;
        }
        case 'payment_intent.succeeded': {
          // Manual capture means order is already confirmed.
          // If automatic capture, this would be the confirm trigger.
          console.log(`[Stripe Webhook] Order ${orderId} payment succeeded`);
          await this.ordersRepo.updateWebhookEventStatus(event.id, 'success');
          break;
        }
        case 'payment_intent.payment_failed': {
          if (['pending'].includes(order.status)) {
            await this.ordersRepo.updateStatus(orderId, 'failed');
            console.log(`[Stripe Webhook] Order ${orderId} marked as failed.`);
          }
          await this.ordersRepo.updateWebhookEventStatus(event.id, 'success');
          break;
        }
        case 'payment_intent.canceled': {
          if (['pending'].includes(order.status)) {
            await this.ordersRepo.updateStatus(orderId, 'cancelled');
            console.log(`[Stripe Webhook] Order ${orderId} marked as cancelled.`);
          }
          await this.ordersRepo.updateWebhookEventStatus(event.id, 'success');
          break;
        }
        case 'charge.refunded': {
          await this.ordersRepo.updateStatus(orderId, 'refunded');
          console.log(`[Stripe Webhook] Order ${orderId} marked as refunded.`);
          await this.ordersRepo.updateWebhookEventStatus(event.id, 'success');
          break;
        }
        default: {
          await this.ordersRepo.updateWebhookEventStatus(event.id, 'ignored');
          break;
        }
      }
    } catch (error: any) {
      console.error(`[Stripe Webhook] Processing failed for ${event.id}:`, error);
      await this.ordersRepo.updateWebhookEventStatus(event.id, 'failed', error.message);
    }

    return { received: true };
  }
}

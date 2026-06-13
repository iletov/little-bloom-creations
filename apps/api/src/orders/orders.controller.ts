import {
  Controller,
  Post,
  Body,
  Req,
  Headers,
  BadRequestException,
  Get,
  Param,
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
    private readonly stripeService: StripeService,
  ) {}

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
      // Оправя грешката "err is of type unknown"
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'payment_intent.amount_capturable_updated') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const orderId = paymentIntent.metadata.orderId;

      try {
        await this.confirmStripeOrderUseCase.execute(orderId, paymentIntent.id);
        console.log(`[Stripe Webhook] Order ${orderId} confirmed.`);
      } catch (error: any) {
        // Оправя грешката "error is of type unknown"
        console.error(
          `[Stripe Webhook] Fulfillment failed for ${orderId}:`,
          error,
        );
        // We do NOT call refundPayment here because ConfirmStripeOrderUseCase 
        // already cancels the uncaptured PaymentIntent.
      }
    }

    return { received: true };
  }
}

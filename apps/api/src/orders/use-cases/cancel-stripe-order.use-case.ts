import { Injectable } from '@nestjs/common';
import { StripeService } from '../../stripe/stripe.service';
import { CancelStripeOrderDto } from '../dto/cancel-stripe-order.dto';

@Injectable()
export class CancelStripeOrderUseCase {
  constructor(private readonly stripeService: StripeService) {}

  async execute(dto: CancelStripeOrderDto) {
    return this.stripeService.cancelPayment(dto.paymentIntentId, dto.reason);
  }
}

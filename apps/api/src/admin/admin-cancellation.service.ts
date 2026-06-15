import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { AdminRepository } from './admin.repository';
import { StripeService } from '../stripe/stripe.service';

@Injectable()
export class AdminCancellationService {
  private readonly logger = new Logger(AdminCancellationService.name);

  constructor(
    private readonly stripeService: StripeService,
    private readonly adminRepository: AdminRepository,
  ) {}

  async cancelOrder(orderId: string) {
    // 1. Fetch order
    const orderData = await this.adminRepository.getOrderWithItems(orderId);

    if (!orderData) {
      throw new BadRequestException(`Order ${orderId} not found`);
    }

    if (orderData.status === 'cancelled') {
      throw new BadRequestException('Order is already cancelled');
    }

    // 2. Handle Stripe Refund/Cancel if applicable
    if (orderData.paymentMethod === 'stripe' && orderData.stripePaymentIntentId) {
      try {
        if (['confirmed', 'shipped', 'processing'].includes(orderData.status)) {
          // Payment was already captured, so we refund it
          await this.stripeService.refundPayment(
            orderData.stripePaymentIntentId,
            'requested_by_customer'
          );
          this.logger.log(`Refunded Stripe Payment ${orderData.stripePaymentIntentId} for Order ${orderId}`);
        } else if (orderData.status === 'pending') {
          // Payment is authorized but not captured yet, so we cancel the intent
          await this.stripeService.cancelPayment(
            orderData.stripePaymentIntentId,
            'requested_by_customer'
          );
          this.logger.log(`Canceled pending Stripe Payment ${orderData.stripePaymentIntentId} for Order ${orderId}`);
        }
      } catch (error) {
        this.logger.error(`Failed to reverse payment for order ${orderId}`, error);
        throw new BadRequestException(`Could not reverse Stripe payment: ${error.message}`);
      }
    }

    // 3 & 4. Restore Inventory and Update status to cancelled via Repository
    const updatedOrder = await this.adminRepository.cancelOrderAndRestoreStock(orderId, orderData.items || []);
    this.logger.log(`Restored inventory for order ${orderId}`);

    return {
      success: true,
      message: 'Order cancelled successfully',
      order: updatedOrder,
    };
  }
}

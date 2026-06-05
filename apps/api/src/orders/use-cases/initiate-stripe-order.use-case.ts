import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { OrdersRepository } from '../repositories/orders.repository';
import { StripeService } from '../../stripe/stripe.service';
import { PlaceStripeOrderDto } from '../dto/place-stripe-order.dto';
import { OrderStatus, PaymentMethodEnum } from '@repo/shared-types';

@Injectable()
export class InitiateStripeOrderUseCase {
  constructor(
    private readonly ordersRepo: OrdersRepository,
    private readonly stripeService: StripeService,
  ) {}

  async execute(dto: PlaceStripeOrderDto) {
    try {
      const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      const subtotal = dto.items.reduce((sum, item) => {
        return sum + item.unitPrice * item.quantity;
      }, 0);

      const deliveryCost = dto.deliveryCost;
      const totalAmount = subtotal + deliveryCost;

      const orderData = {
        orderNumber,
        status: 'pending' as OrderStatus,
        totalAmount: totalAmount.toFixed(2),
        subtotal: subtotal.toFixed(2),
        deliveryCost: deliveryCost.toFixed(2),
        deliveryMethod: dto.deliveryMethod,
        paymentMethod: 'stripe' as PaymentMethodEnum,
      };

      const shippingData = {
        orderId: '',
        fullName: `${dto.recipientInfo.firstName} ${dto.recipientInfo.lastName}`,
        email: dto.recipientInfo.email || '',
        phone: dto.recipientInfo.phone,
        country: dto.recipientAddress.country || 'BG',
        city: dto.recipientAddress.city,
        postalCode: dto.recipientAddress.postalCode || '',
        street: dto.recipientAddress.street || null,
        streetNumber: dto.recipientAddress.streetNumber || null,
        officeCode: dto.recipientInfo.officeId || null,
      };

      const itemsData = dto.items.map((item) => ({
        orderId: '',
        productId: item.productId,
        variantId: item.variantId || null,
        name: item.name,
        variantName: item.variantName || null,
        quantity: item.quantity,
        unitPrice: item.unitPrice.toString(),
        subtotal: (item.unitPrice * item.quantity).toString(),
        weight: item.weight.toString(),
        personalization: item.personalization || null,
      }));

      const orderId = await this.ordersRepo.createFullOrder(
        orderData,
        shippingData,
        itemsData,
      );

      const paymentIntent = await this.stripeService.createPaymentIntent(
        totalAmount,
        {
          orderId: orderId,
          orderNumber: orderNumber,
        },
        dto.recipientInfo.email,
      );

      // 8. Обновяваме поръчката със Stripe ID-то за проследимост
      await this.ordersRepo.savePaymentIntent(orderId, paymentIntent.id);

      // 9. Връщаме нужните данни на контролера
      return {
        orderNumber,
        clientSecret: paymentIntent.client_secret ?? undefined,
        paymentIntentId: paymentIntent.id,
      };
    } catch (error) {
      console.error('Error initiating Stripe order:', error);
      throw new InternalServerErrorException('Failed to initiate order');
    }
  }
}

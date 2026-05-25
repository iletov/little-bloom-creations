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
      // 1. Генерираме уникален номер на поръчката
      const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      // 2. Смятаме сумите наново на базата на подадените артикули в DTO-то
      const subtotal = dto.items.reduce((sum, item) => {
        return sum + item.unitPrice * item.quantity;
      }, 0);

      const deliveryCost = dto.deliveryCost;
      const totalAmount = subtotal + deliveryCost;

      // 3. Подготвяме основните данни за поръчката спрямо Drizzle схемата ти
      const orderData = {
        orderNumber,
        status: 'pending' as OrderStatus,
        totalAmount: totalAmount.toFixed(2), // numeric колоната очаква string
        subtotal: subtotal.toFixed(2),
        deliveryCost: deliveryCost.toFixed(2),
        deliveryMethod: dto.deliveryMethod,
        paymentMethod: 'stripe' as PaymentMethodEnum,
      };

      // 4. Мапваме данните за доставка от твоите обекти recipientInfo и recipientAddress
      const shippingData = {
        orderId: '', // Стриктен тип за Drizzle, репозиторито ще го попълни
        fullName: `${dto.recipientInfo.firstName} ${dto.recipientInfo.lastName}`,
        email: dto.recipientInfo.email || '',
        phone: dto.recipientInfo.phone,
        country: dto.recipientAddress.country || 'BG',
        city: dto.recipientAddress.city,
        postalCode: dto.recipientAddress.postalCode || '',
        street: dto.recipientAddress.street || null,
        streetNumber: dto.recipientAddress.streetNumber || null,
        officeCode: dto.recipientInfo.officeId || null, // officeId от DTO-то ти мапва към officeCode
      };

      // 5. Мапваме артикулите от твоя масив items
      const itemsData = dto.items.map((item) => ({
        orderId: '', // Стриктен тип за Drizzle, репозиторито ще го попълни
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

      // 6. Записваме PENDING поръчката и връзките ѝ в базата данни чрез Drizzle
      const orderId = await this.ordersRepo.createFullOrder(
        orderData,
        shippingData,
        itemsData,
      );

      // 7. Създаваме Payment Intent в Stripe
      const paymentIntent = await this.stripeService.createPaymentIntent(
        totalAmount,
        {
          orderId: orderId, // Изключително важно за Webhook-a
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
      };
    } catch (error) {
      console.error('Error initiating Stripe order:', error);
      throw new InternalServerErrorException('Failed to initiate order');
    }
  }
}

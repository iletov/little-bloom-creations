import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { OrdersRepository, InsertOrderItemType } from '../repositories/orders.repository';
import { StripeService } from '../../stripe/stripe.service';
import { PlaceStripeOrderDto } from '../dto/place-stripe-order.dto';
import { OrderStatus, PaymentMethodEnum } from '@repo/shared-types';

import { ProductsRepository } from '../../products/products.repository';

interface InitiateStripeOrderResult {
  orderNumber: string;
  clientSecret?: string;
  paymentIntentId: string;
}

@Injectable()
export class InitiateStripeOrderUseCase {
  constructor(
    private readonly ordersRepo: OrdersRepository,
    private readonly stripeService: StripeService,
    private readonly productsRepo: ProductsRepository,
  ) {}

  async execute(dto: PlaceStripeOrderDto): Promise<InitiateStripeOrderResult> {
    try {
      const subtotal = dto.items.reduce((sum, item) => {
        return sum + item.unitPrice * item.quantity;
      }, 0);

      const deliveryCost = dto.deliveryCost;
      const totalAmount = subtotal + deliveryCost;
      const reusablePayment = await this.findReusablePayment(
        dto,
        totalAmount,
      );

      if (reusablePayment) {
        return reusablePayment;
      }

      const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

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

      const itemsData: InsertOrderItemType[] = [];
      for (const item of dto.items) {
        if (!item.sku || item.sku === 'N/A') {
          throw new InternalServerErrorException(`Item ${item.name} is missing SKU`);
        }

        const product = await this.productsRepo.findBySku(item.sku);

        if (!product) {
          throw new InternalServerErrorException(`Product with SKU ${item.sku} not found in database`);
        }

        let variantId: string | null = null;
        if (item.variantSku && product.variants) {
           const variant = product.variants.find(
             (v) => v.variant_sku === item.variantSku || (v as typeof v & { variantSku?: string }).variantSku === item.variantSku
           );
           if (variant) {
             variantId = variant.id;
           }
        }

        itemsData.push({
          orderId: '',
          productId: product.id,
          variantId: variantId,
          name: item.name,
          variantName: item.variantName || null,
          quantity: item.quantity,
          unitPrice: item.unitPrice.toString(),
          subtotal: (item.unitPrice * item.quantity).toString(),
          weight: item.weight.toString(),
          personalization: item.personalization || null,
        });
      }

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

  private async findReusablePayment(
    dto: PlaceStripeOrderDto,
    totalAmount: number,
  ): Promise<InitiateStripeOrderResult | null> {
    if (!dto.existingOrderNumber || !dto.existingPaymentIntentId) {
      return null;
    }

    const existingOrder = await this.ordersRepo.findByOrderNumber(
      dto.existingOrderNumber,
    );

    if (
      !existingOrder ||
      existingOrder.status !== 'pending' ||
      existingOrder.stripePaymentIntentId !== dto.existingPaymentIntentId
    ) {
      return null;
    }

    const hasSameCheckoutTerms =
      Number(existingOrder.totalAmount) === Number(totalAmount.toFixed(2)) &&
      existingOrder.deliveryMethod === dto.deliveryMethod;

    if (!hasSameCheckoutTerms) {
      await this.stripeService.cancelPayment(
        dto.existingPaymentIntentId,
        'Checkout details changed',
      );
      await this.ordersRepo.updateStatus(existingOrder.id, 'cancelled');
      return null;
    }

    const paymentIntent = await this.stripeService.retrievePaymentIntent(
      dto.existingPaymentIntentId,
    );
    const reusableStatuses = new Set([
      'requires_payment_method',
      'requires_confirmation',
      'requires_action',
      'requires_capture',
      'processing',
      'succeeded',
    ]);

    if (!reusableStatuses.has(paymentIntent.status)) {
      if (paymentIntent.status === 'canceled') {
        await this.ordersRepo.updateStatus(existingOrder.id, 'cancelled');
      }
      return null;
    }

    return {
      orderNumber: existingOrder.orderNumber,
      clientSecret: paymentIntent.client_secret ?? undefined,
      paymentIntentId: paymentIntent.id,
    };
  }
}

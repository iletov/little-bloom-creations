import { Injectable, BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import {
  OrdersRepository,
  InsertOrderType,
  InsertOrderShippingType,
  InsertOrderItemType,
} from '../repositories/orders.repository';

import { PlaceCashOrderDto } from '../dto/place-cash-order.dto';
import { PlaceOrderResponse } from '../orders.controller';

import { PaymentMethodEnum } from '@repo/shared-types';
import { ProductsRepository } from '../../products/products.repository';
import { TransactionManager } from '../../database/transaction.manager';

@Injectable()
export class PlaceCashOrderUseCase {
  constructor(
    private readonly ordersRepo: OrdersRepository,
    private readonly productsRepo: ProductsRepository,
  ) {}

  async execute(dto: PlaceCashOrderDto): Promise<PlaceOrderResponse> {
    return TransactionManager.runInTransaction(async () => {
      const orderId = uuidv4();
      const orderNumber = `LBC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const subtotal = dto.totalAmount - dto.deliveryCost;

      for (const item of dto.items) {
        await this.productsRepo.decreaseStockSafely(item.sku, item.quantity);
      }

      const orderData: InsertOrderType = {
        id: orderId,
        orderNumber,
        status: 'confirmed', // Или 'new' / 'pending_processing' според твоя enum
        totalAmount: dto.totalAmount.toString(),
        subtotal: subtotal.toString(),
        deliveryCost: dto.deliveryCost.toString(),
        deliveryMethod: dto.deliveryMethod,
        paymentMethod: PaymentMethodEnum.CASH,
        shipmentNumber: null, // Товарителницата ще се попълни по-късно от Админа
      };

      const shippingData: InsertOrderShippingType = {
        id: uuidv4(),
        orderId,
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

      const itemsData: InsertOrderItemType[] = dto.items.map((item) => ({
        id: uuidv4(),
        orderId,
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

      await this.ordersRepo.createFullOrder(orderData, shippingData, itemsData);

      return { orderNumber };
    });
  }
}

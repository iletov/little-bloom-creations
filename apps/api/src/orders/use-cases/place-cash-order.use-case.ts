import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import {
  OrdersRepository,
  InsertOrderType,
  InsertOrderShippingType,
  InsertOrderItemType,
} from '../repositories/orders.repository';

import { ShippingProviderFactory } from '../../shipping/factories/shipping-provider.factory';
import { PlaceCashOrderDto } from '../dto/place-cash-order.dto';

import { CreateWaybillRequest } from '../../shipping/domain/models';
import { ProductsRepository } from 'src/products/products.repository';
import { TransactionManager } from 'src/database/transaction.manager';
import { PaymentMethodEnum } from '@repo/shared-types';

// Стриктен договор, който Контролерът също използва
export interface PlaceOrderResponse {
  orderNumber: string;
  waybillNumber: string;
}

@Injectable()
export class PlaceCashOrderUseCase {
  constructor(
    private readonly ordersRepo: OrdersRepository,
    private readonly productsRepo: ProductsRepository,
    private readonly shippingFactory: ShippingProviderFactory,
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
        status: 'confirmed', // Според твоя orderStatusEnum
        totalAmount: dto.totalAmount.toString(),
        subtotal: subtotal.toString(),
        deliveryCost: dto.deliveryCost.toString(),
        deliveryMethod: dto.deliveryMethod,
        paymentMethod: PaymentMethodEnum.CASH,
        // createdAt ще бъде сложен автоматично от defaultNow()
      };

      const shippingData: InsertOrderShippingType = {
        id: uuidv4(),
        orderId, // Foreign Key към orders
        fullName: `${dto.recipientInfo.firstName} ${dto.recipientInfo.lastName}`,
        email: dto.recipientInfo.email || 'no-email@example.com',
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

      // 3. Записваме ги в DB (Transaction Context)
      await this.ordersRepo.createFullOrder(orderData, shippingData, itemsData);

      // 4. Генериране на товарителница през Anti-Corruption Layer
      const shippingProvider = this.shippingFactory.getProvider(
        dto.deliveryMethod,
      );

      const waybillRequest: CreateWaybillRequest = {
        deliveryMethod: dto.deliveryMethod,
        paymentMethod: PaymentMethodEnum.CASH,
        totalWeight: dto.totalWeight,
        totalAmount: dto.totalAmount,
        recipientAddress: dto.recipientAddress,
        recipientInfo: dto.recipientInfo,
        parcels: [
          {
            seqNo: 1,
            weight: dto.totalWeight,
            width: 10,
            height: 10,
            depth: 10,
          },
        ],
        senderInfo: { name: 'Little Bloom Creations', phone: '0888000000' },
        shipmentDescription: dto.shipmentDescription || 'Бебешки подаръци',
        receiptItems: dto.items.map((i) => ({
          name: i.name,
          price: i.unitPrice,
          quantity: i.quantity,
        })),
      };

      const waybillResult =
        await shippingProvider.createWaybill(waybillRequest);

      if (!waybillResult.waybillNumber) {
        throw new InternalServerErrorException(
          'Courier API succeeded but returned no Waybill Number.',
        );
      }

      await this.ordersRepo.updateShipmentNumber(
        orderNumber,
        waybillResult.waybillNumber,
      );

      return {
        orderNumber,
        waybillNumber: waybillResult.waybillNumber,
      };
    });
  }
}

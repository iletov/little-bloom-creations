import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GetSanitySenderInfoUseCase } from '../sanity/use-cases/get-sanity-sender-info.use-case';
import { AdminRepository } from './admin.repository';

type OrderWithShipping = any; // We can use 'any' or exact type if we export it from repository

@Injectable()
export class AdminWaybillService {
  private readonly logger = new Logger(AdminWaybillService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly getSanitySenderInfoUseCase: GetSanitySenderInfoUseCase,
    private readonly adminRepository: AdminRepository,
  ) {}

  async generateWaybill(orderId: string) {
    // 1. Fetch order & shipping details
    const orderData = await this.adminRepository.getOrderWithShipping(orderId);

    if (!orderData) throw new BadRequestException(`Order ${orderId} not found`);
    if (!orderData.shipping) throw new BadRequestException('Shipping data missing for this order');
    if (orderData.shipmentNumber) throw new BadRequestException(`Order already has a waybill: ${orderData.shipmentNumber}`);
    if (orderData.status === 'pending') throw new BadRequestException('Cannot generate a waybill for a pending order. Please wait for the payment to be completed or the order to be confirmed.');

    const isEkont = orderData.deliveryMethod.startsWith('ekont');
    const isSpeedy = orderData.deliveryMethod.startsWith('speedy');

    let shipmentNumber: string | null = null;
    let shipmentData: any = null;

    if (isEkont) {
      const result = await this.generateEkontWaybill(orderData);
      shipmentNumber = result.shipmentNumber;
      shipmentData = result;
    } else if (isSpeedy) {
      const result = await this.generateSpeedyWaybill(orderData);
      shipmentNumber = result.shipmentNumber;
      shipmentData = result;
    } else {
      throw new BadRequestException('Unsupported delivery method');
    }

    // Update DB
    if (shipmentNumber) {
      await this.adminRepository.saveWaybill(
        orderId, 
        shipmentNumber, 
        shipmentData?.totalPrice && (!orderData.deliveryCost || Number(orderData.deliveryCost) === 0) ? String(shipmentData.totalPrice) : undefined
      );
        
      this.logger.log(`Created waybill ${shipmentNumber} for order ${orderId}`);
      this.logger.log(`Generated waybill ${shipmentNumber} for order ${orderId}`);
    }

    return {
      success: true,
      shipmentNumber,
      shipmentData,
    };
  }

  private async generateEkontWaybill(order: OrderWithShipping) {
    const ekontApiKey = this.configService.get<string>('EKONT_API_KEY');
    const ekontUrl = this.configService.get<string>('EKONT_API_URL');
    const auth = Buffer.from(`${ekontApiKey}`).toString('base64');

    const shipping = order.shipping;
    const isPickup = order.deliveryMethod?.startsWith('ekont-office') ?? false;
    const isPaymentCash = order.paymentMethod === 'cash';

    const senderInfo = await this.getSanitySenderInfoUseCase.execute('ekont');

    const labelData = {
      label: {
        senderClient: {
          name: senderInfo?.senderClient?.name || 'LITTLE BLOOM CREATIONS',
          nameEn: senderInfo?.senderClient?.nameEn,
          phones: senderInfo?.senderClient?.phones || ['0888112233'],
          email: senderInfo?.senderClient?.email,
          juridicalEntity: senderInfo?.senderClient?.juridicalEntity,
          ein: senderInfo?.senderClient?.ein,
          ddsEinPrefix: senderInfo?.senderClient?.ddsEinPrefix,
          ddsEin: senderInfo?.senderClient?.ddsEin,
        },
        senderAgent: {
          name: senderInfo?.senderAgent?.name || senderInfo?.senderClient?.name || 'LITTLE BLOOM CREATIONS',
          phones: senderInfo?.senderClient?.phones || ['0888112233'],
        },
        senderAddress: {
          city: { 
            name: senderInfo?.senderAddress?.city || 'Плевен', 
            postCode: senderInfo?.senderAddress?.postCode || '5800', 
            country: { code3: 'BGR' } 
          },
          street: senderInfo?.senderAddress?.street || '',
          num: senderInfo?.senderAddress?.num || '',
          quarter: '',
          other: '',
        },
        receiverClient: {
          name: shipping.fullName,
          phones: [shipping.phone],
        },
        receiverAddress: {
          city: { name: shipping.city, postCode: shipping.postalCode || '', country: { code3: 'BGR' } },
          street: !isPickup ? (shipping.street || '') : '',
          num: !isPickup ? (shipping.streetNumber || '') : '',
          quarter: '',
          other: !isPickup ? (shipping.additionalInfo || '') : '',
        },
        receiverOfficeCode: isPickup ? shipping.officeCode : '',
        senderOfficeCode: senderInfo?.senderOfficeCode || '5803',
        receiverDeliveryType: isPickup ? 'office' : 'delivery',
        senderDeliveryType: senderInfo?.senderDeliveryType || 'office',
        payAfterAccept: isPaymentCash ? (senderInfo?.payAfterAccept || 0) : 0,
        payAfterTest: isPaymentCash ? (senderInfo?.payAfterTest || 0) : 0,
        paymentSenderMethod: senderInfo?.paymentSenderMethod || '',
        paymentSenderAmount: senderInfo?.paymentSenderAmount || '',
        paymentReceiverMethod: senderInfo?.paymentReceiverMethod || '',
        packCount: 1,
        shipmentType: 'PACK',
        weight: 1, // default weight
        shipmentDescription: `Поръчка ${order.orderNumber}`,
        services: isPaymentCash ? {
          cdType: 'GET',
          cdAmount: Number(order.totalAmount).toFixed(2),
          cdCurrency: 'BGN',
        } : null,
      },
      mode: 'create',
    };

    const res = await fetch(`${ekontUrl}/Shipments/LabelService.createLabel.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify(labelData),
    });

    if (!res.ok) {
      const errorText = await res.text();
      this.logger.error('Ekont Creation Error:', errorText);
      let errorDetails = errorText;
      try {
        errorDetails = JSON.parse(errorText);
      } catch (e) {}
      throw new BadRequestException({
        message: 'Econt API error',
        details: errorDetails,
      });
    }

    const data = await res.json();
    if (data?.label?.error) {
      throw new BadRequestException(`Econt Logic Error: ${data.label.error.message || JSON.stringify(data.label.error)}`);
    }

    return {
      shipmentNumber: data.label.shipmentNumber,
      pdfUrl: data.label.pdfUrl || null,
      totalPrice: data.label.totalPrice,
      raw: data,
    };
  }

  private async generateSpeedyWaybill(order: OrderWithShipping) {
    const speedyUrl = this.configService.get<string>('SPEEDY_BASE_URL');
    const userName = this.configService.get<string>('SPEEDY_USER');
    const password = this.configService.get<string>('SPEEDY_PASS');

    const shipping = order.shipping;
    const isPickup = order.deliveryMethod?.startsWith('speedy-office') ?? false;
    const isPaymentCash = order.paymentMethod === 'cash';

    const senderInfo = await this.getSanitySenderInfoUseCase.execute('speedy');

    const recipient = isPickup
      ? {
          phone1: { number: shipping.phone },
          privatePerson: true,
          clientName: shipping.fullName,
          email: shipping.email,
          pickupOfficeId: Number(shipping.officeCode) || 0,
        }
      : {
          phone1: { number: shipping.phone },
          privatePerson: true,
          clientName: shipping.fullName,
          email: shipping.email,
          address: {
            siteId: Number(shipping.postalCode) || 68134, // Mock/fallback
            streetName: shipping.street,
            streetNo: shipping.streetNumber,
            additionalInfo: shipping.additionalInfo,
          },
        };

    const additionalServices = isPaymentCash
      ? {
          cod: {
            amount: Number(order.totalAmount),
            processingType: 'CASH',
            payoutToLoggedClient: true,
          },
          declaredValue: { amount: Number(order.totalAmount), fragile: true },
        }
      : {
          declaredValue: { amount: Number(order.totalAmount), fragile: true },
        };

    const shipmentData = {
      userName,
      password,
      sender: {
        clientId: senderInfo?.sender?.clientId || '9999999998000',
        contactName: senderInfo?.sender?.contactName || 'LITTLE BLOOM CREATIONS',
        phone1: { number: senderInfo?.sender?.phone1?.number || '0888112233' },
      },
      recipient,
      service: {
        serviceId: 505,
        additionalServices,
      },
      content: {
        parcelsCount: 1,
        totalWeight: 1,
        parcels: [{ seqNo: 1, weight: 1 }],
        contents: `Поръчка ${order.orderNumber}`,
        package: 'ENVELOP',
      },
      payment: {
        courierServicePayer: 'RECIPIENT',
      },
    };

    const res = await fetch(`${speedyUrl}/shipment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(shipmentData),
    });

    if (!res.ok) {
      const errorText = await res.text();
      this.logger.error('Speedy Creation Error:', errorText);
      let errorDetails = errorText;
      try {
        errorDetails = JSON.parse(errorText);
      } catch (e) {}
      throw new BadRequestException({
        message: 'Speedy API error',
        details: errorDetails,
      });
    }

    const data = await res.json();
    if (data.error) {
      throw new BadRequestException(`Speedy Error: ${data.error.message}`);
    }

    return {
      shipmentNumber: data.shipmentId || data.id,
      totalPrice: data.price?.total,
      raw: data,
    };
  }
}

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpeedyShippingAdapter = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const exceptions_1 = require("../domain/exceptions");
const shared_types_1 = require("@repo/shared-types");
const rxjs_2 = require("rxjs");
function isCreateWaybillRequest(request) {
    return 'senderInfo' in request;
}
let SpeedyShippingAdapter = class SpeedyShippingAdapter {
    httpService;
    speedyUrl = process.env.SPEEDY_BASE_URL || '';
    userName = process.env.SPEEDY_USER || '';
    password = process.env.SPEEDY_PASS || '';
    constructor(httpService) {
        this.httpService = httpService;
    }
    async validateAddress(address) {
        try {
            const payload = {
                userName: this.userName,
                password: this.password,
                siteId: address.siteId,
                name: address.street || address.city,
            };
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.speedyUrl}/location/street`, payload));
            return response.data;
        }
        catch (error) {
            throw new exceptions_1.ShippingProviderException('Failed to validate address with Speedy', error);
        }
    }
    buildBasePayload(request) {
        const isPickup = request.deliveryMethod === shared_types_1.DeliveryMethodEnum.SPEEDY_OFFICE;
        const isCash = request.paymentMethod === shared_types_1.PaymentMethodEnum.CASH;
        const isCreate = isCreateWaybillRequest(request);
        const recipient = {
            privatePerson: true,
            clientName: request.recipientInfo.clientName ||
                `${request.recipientInfo.firstName} ${request.recipientInfo.lastName}`,
            phone1: { number: request.recipientInfo.phone },
            email: request.recipientInfo.email,
        };
        if (isPickup) {
            recipient.pickupOfficeId = request.recipientInfo.officeId;
        }
        else {
            recipient.address = {
                siteId: request.recipientAddress.siteId,
                streetId: request.recipientAddress.streetId,
                streetNo: request.recipientAddress.streetNumber,
                blockNo: request.recipientAddress.blockNo,
                entranceNo: request.recipientAddress.entranceNo,
                floorNo: request.recipientAddress.floorNo,
                apartmentNo: request.recipientAddress.apartmentNo,
            };
            recipient.addressLocation = { siteId: request.recipientAddress.siteId };
        }
        const additionalServices = {
            obpd: {
                option: 'OPEN',
                returnShipmentServiceId: 505,
                returnShipmentPayer: 'SENDER',
            },
            declaredValue: {
                amount: request.totalAmount,
                fragile: true,
            },
        };
        if (isCash) {
            additionalServices.cod = {
                amount: request.totalAmount,
                processingType: 'CASH',
                payoutToLoggedClient: true,
                fiscalReceiptItems: isCreate ? request.receiptItems || [] : [],
            };
        }
        return {
            userName: this.userName,
            password: this.password,
            recipient,
            service: {
                autoAdjustPickupDate: true,
                serviceId: 505,
                serviceIds: [505],
                saturdayDelivery: true,
                additionalServices,
            },
            content: {
                parcelsCount: request.parcels.length,
                parcels: request.parcels,
                contents: isCreate && request.shipmentDescription
                    ? request.shipmentDescription
                    : 'КАНЦ. МАТЕР.',
                package: 'ENVELOP',
            },
            payment: {
                courierServicePayer: 'RECIPIENT',
                declaredValuePayer: 'RECIPIENT',
            },
            sender: {
                dropoffOfficeId: 275,
                clientId: 9999999998000,
            },
        };
    }
    async validateShipment(request) {
        try {
            const payload = this.buildBasePayload(request);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.speedyUrl}/validation/shipment`, payload));
            if (response.data?.error) {
                throw new Error(JSON.stringify(response.data.error));
            }
        }
        catch (error) {
            console.error('Speedy Validation Error:', error?.response?.data || error?.message || error);
            throw new exceptions_1.ShippingProviderException('Failed to validate shipment with Speedy', error?.response?.data || error?.message || {});
        }
    }
    async calculateShipping(request) {
        try {
            const payload = this.buildBasePayload(request);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.speedyUrl}/calculate`, payload));
            console.log('Speedy API Response Data:', JSON.stringify(response.data, null, 2));
            const calculations = response.data?.calculations;
            if (!calculations || calculations.length === 0) {
                throw new Error('No calculations returned from Speedy');
            }
            return {
                price: calculations[0].price.total,
                rawDetails: calculations[0],
            };
        }
        catch (error) {
            console.error('Speedy API Error:', error?.response?.data || error?.message || error);
            throw new exceptions_1.ShippingProviderException('Failed to calculate shipping with Speedy', error?.response?.data || error?.message || {});
        }
    }
    async createWaybill(request) {
        try {
            const payload = this.buildBasePayload(request);
            if (request.senderInfo) {
                payload.sender = {
                    clientId: payload.sender?.clientId || 9999999998000,
                    dropoffOfficeId: payload.sender?.dropoffOfficeId,
                    contactName: request.senderInfo.name,
                    email: request.senderInfo.email,
                    phone1: { number: request.senderInfo.phone },
                };
            }
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.speedyUrl}/shipment`, payload));
            const data = response.data;
            return {
                waybillNumber: data.id || data.shipmentId || '',
                price: data.price?.total || 0,
                rawDetails: data,
            };
        }
        catch (error) {
            throw new exceptions_1.ShippingProviderException('Failed to create waybill with Speedy', error);
        }
    }
    async getCities(countryCode) {
        try {
            const response = await (0, rxjs_2.lastValueFrom)(this.httpService.post(`${this.speedyUrl}/location/site`, {
                userName: this.userName,
                password: this.password,
                countryId: countryCode === 'BGR' || !countryCode ? '100' : countryCode,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            }));
            const sites = response.data.sites || [];
            return sites.map((site) => ({
                id: site.id,
                name: site.name,
                nameEn: site.nameEn,
                postCode: site.postCode,
                region: site.municipality || '',
            }));
        }
        catch (error) {
            throw new exceptions_1.ShippingProviderException('Failed to fetch cities from Speedy', error);
        }
    }
    async getOffices(cityId) {
        try {
            const payload = {
                userName: this.userName,
                password: this.password,
                countryId: '100',
            };
            if (cityId) {
                payload.siteId = Number(cityId);
            }
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.speedyUrl}/location/office`, payload, {
                headers: { 'Content-Type': 'application/json' },
            }));
            const offices = response.data.offices || [];
            return offices.map((office) => ({
                id: office.id,
                name: office.name,
                address: office.address?.fullAddressString ||
                    office.address?.localAddressString ||
                    '',
                cityId: office.siteId,
            }));
        }
        catch (error) {
            throw new exceptions_1.ShippingProviderException('Failed to fetch offices from Speedy', error);
        }
    }
};
exports.SpeedyShippingAdapter = SpeedyShippingAdapter;
exports.SpeedyShippingAdapter = SpeedyShippingAdapter = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], SpeedyShippingAdapter);
//# sourceMappingURL=speedy-shipping.adapter.js.map
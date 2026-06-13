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
exports.EcontShippingAdapter = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const exceptions_1 = require("../domain/exceptions");
const shared_types_1 = require("@repo/shared-types");
function isCreateWaybillRequest(request) {
    return 'senderInfo' in request;
}
let EcontShippingAdapter = class EcontShippingAdapter {
    httpService;
    econtUrl = process.env.EKONT_API_URL || '';
    apiKey = process.env.ECONT_API_KEY || '';
    authHeader = `Basic ${Buffer.from(this.apiKey).toString('base64')}`;
    constructor(httpService) {
        this.httpService = httpService;
    }
    getHeaders() {
        return {
            'Content-Type': 'application/json',
            Authorization: this.authHeader,
        };
    }
    async validateAddress(address, postalCode) {
        try {
            const payload = {
                address: {
                    city: {
                        postCode: postalCode || address.postalCode || '',
                        name: address.city,
                    },
                    street: address.street || '',
                    num: address.streetNumber || '',
                    other: address.other || '',
                },
            };
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.econtUrl}/Nomenclatures/AddressService.validateAddress.json`, payload, { headers: this.getHeaders() }));
            return response.data;
        }
        catch (error) {
            throw new exceptions_1.ShippingProviderException('Failed to validate address with Econt', error);
        }
    }
    buildLabelPayload(request, mode) {
        const isPickup = request.deliveryMethod === shared_types_1.DeliveryMethodEnum.EKONT_OFFICE;
        const isCash = request.paymentMethod === shared_types_1.PaymentMethodEnum.CASH;
        const isCreate = isCreateWaybillRequest(request);
        const senderClient = isCreate
            ? {
                name: request.senderInfo.name,
                phones: [request.senderInfo.phone],
                email: request.senderInfo.email,
            }
            : { name: 'SENDER', phones: ['0000000000'] };
        const services = isCash
            ? {
                cdType: 'GET',
                cdAmount: Number(request.totalAmount).toFixed(2),
                cdCurrency: 'BGN',
            }
            : null;
        const labelData = {
            label: {
                senderClient,
                senderOfficeCode: '5812',
                receiverClient: {
                    name: request.recipientInfo.clientName ||
                        `${request.recipientInfo.firstName} ${request.recipientInfo.lastName}`,
                    phones: [request.recipientInfo.phone],
                },
                receiverAddress: {
                    city: {
                        name: request.recipientAddress.city,
                        postCode: request.recipientAddress.postalCode || '',
                        country: { code3: 'BGR' },
                    },
                    street: !isPickup ? request.recipientAddress.street || '' : '',
                    num: !isPickup ? request.recipientAddress.streetNumber || '' : '',
                    quarter: !isPickup ? request.recipientAddress.quarter || '' : '',
                    other: !isPickup ? request.recipientAddress.other || '' : '',
                },
                receiverOfficeCode: isPickup && request.recipientInfo.officeId
                    ? String(request.recipientInfo.officeId)
                    : '',
                receiverDeliveryType: isPickup ? 'office' : 'delivery',
                packCount: request.parcels.length > 0 ? request.parcels.length : 1,
                shipmentType: 'PACK',
                shipmentDescription: 'Стоки',
                weight: request.totalWeight > 0 ? request.totalWeight : 1,
                services,
            },
            mode,
        };
        if (isCreate) {
            if (request.shipmentDescription) {
                labelData.label.shipmentDescription = request.shipmentDescription;
            }
            labelData.label.packingListType = 'digital';
            labelData.label.packingList = request.receiptItems || [];
        }
        return labelData;
    }
    async validateShipment(request) {
        try {
            const payload = this.buildLabelPayload(request, 'validate');
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.econtUrl}/Shipments/LabelService.createLabel.json`, payload, { headers: this.getHeaders() }));
            const data = response.data;
            if (data?.label?.error) {
                throw new Error(JSON.stringify(data.label.error));
            }
        }
        catch (error) {
            const errorDetails = error.response?.data || error.message || error;
            throw new exceptions_1.ShippingProviderException('Failed to validate shipment with Econt', errorDetails);
        }
    }
    async calculateShipping(request) {
        try {
            const payload = this.buildLabelPayload(request, 'calculate');
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.econtUrl}/Shipments/LabelService.createLabel.json`, payload, { headers: this.getHeaders() }));
            const data = response.data;
            if (data?.label?.error) {
                throw new Error(JSON.stringify(data.label.error));
            }
            return {
                price: data?.label?.totalPrice || 0,
                rawDetails: data,
            };
        }
        catch (error) {
            const errorDetails = error.response?.data || error.message || error;
            throw new exceptions_1.ShippingProviderException('Failed to calculate shipping with Econt', errorDetails);
        }
    }
    async createWaybill(request) {
        try {
            const payload = this.buildLabelPayload(request, 'create');
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.econtUrl}/Shipments/LabelService.createLabel.json`, payload, { headers: this.getHeaders() }));
            const data = response.data;
            if (data?.label?.error) {
                throw new Error(JSON.stringify(data.label.error));
            }
            return {
                waybillNumber: data?.label?.shipmentNumber || '',
                price: data?.label?.totalPrice || 0,
                rawDetails: data,
            };
        }
        catch (error) {
            throw new exceptions_1.ShippingProviderException('Failed to create waybill with Econt', error);
        }
    }
    async getCities(countryCode = 'BGR') {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.econtUrl}/Nomenclatures/NomenclaturesService.getCities.json`, { countryCode }, { headers: this.getHeaders() }));
            const cities = response.data.cities;
            return cities.map((city) => ({
                id: city.id,
                name: city.name,
                nameEn: city.nameEn,
                postCode: city.postCode,
                region: city.regionName || '',
            }));
        }
        catch (error) {
            throw new exceptions_1.ShippingProviderException('Failed to fetch cities from Econt', error);
        }
    }
    async getOffices(cityId) {
        try {
            const payload = { countryCode: 'BGR' };
            if (cityId) {
                payload.cityID = Number(cityId);
            }
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.econtUrl}/Nomenclatures/NomenclaturesService.getOffices.json`, payload, { headers: this.getHeaders() }));
            let offices = response.data.offices || [];
            if (cityId) {
                offices = offices.filter(o => String(o.cityId) === String(cityId) ||
                    String(o.cityID) === String(cityId) ||
                    String(o.address?.city?.id) === String(cityId));
            }
            return offices.map((office) => ({
                id: office.code || office.id,
                name: office.name,
                address: office.address?.fullAddress || '',
                cityId: office.cityId || office.cityID || office.address?.city?.id || 0,
            }));
        }
        catch (error) {
            throw new exceptions_1.ShippingProviderException('Failed to fetch offices from Econt', error);
        }
    }
};
exports.EcontShippingAdapter = EcontShippingAdapter;
exports.EcontShippingAdapter = EcontShippingAdapter = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], EcontShippingAdapter);
//# sourceMappingURL=econt-shipping.adapter.js.map
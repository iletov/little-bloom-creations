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
exports.ShippingEngineService = void 0;
const common_1 = require("@nestjs/common");
const shipping_provider_factory_1 = require("../factories/shipping-provider.factory");
let ShippingEngineService = class ShippingEngineService {
    factory;
    constructor(factory) {
        this.factory = factory;
    }
    async createWaybill(request) {
        const provider = this.factory.getProvider(request.deliveryMethod);
        const result = await provider.createWaybill(request);
        return result;
    }
    async calculateShipping(request) {
        const provider = this.factory.getProvider(request.deliveryMethod);
        if (provider.validateShipment) {
            await provider.validateShipment(request);
        }
        const result = await provider.calculateShipping(request);
        return result;
    }
    async getCities(providerName, countryCode) {
        const provider = this.factory.getProvider(providerName);
        const result = await provider.getCities(countryCode);
        return result;
    }
    async getOffices(providerName, cityId) {
        const provider = this.factory.getProvider(providerName);
        const result = await provider.getOffices(cityId);
        return result;
    }
};
exports.ShippingEngineService = ShippingEngineService;
exports.ShippingEngineService = ShippingEngineService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [shipping_provider_factory_1.ShippingProviderFactory])
], ShippingEngineService);
//# sourceMappingURL=shipping-engine.service.js.map
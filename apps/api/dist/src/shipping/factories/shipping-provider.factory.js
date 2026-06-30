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
exports.ShippingProviderFactory = void 0;
const common_1 = require("@nestjs/common");
const econt_shipping_adapter_1 = require("../adapters/econt-shipping.adapter");
const speedy_shipping_adapter_1 = require("../adapters/speedy-shipping.adapter");
const shared_types_1 = require("@repo/shared-types");
let ShippingProviderFactory = class ShippingProviderFactory {
    econtAdapter;
    speedyAdapter;
    constructor(econtAdapter, speedyAdapter) {
        this.econtAdapter = econtAdapter;
        this.speedyAdapter = speedyAdapter;
    }
    getProvider(deliveryMethod) {
        switch (deliveryMethod) {
            case shared_types_1.DeliveryMethodEnum.EKONT_OFFICE:
            case shared_types_1.DeliveryMethodEnum.EKONT_DELIVERY:
                return this.econtAdapter;
            case shared_types_1.DeliveryMethodEnum.SPEEDY_OFFICE:
            case shared_types_1.DeliveryMethodEnum.SPEEDY_DELIVERY:
                return this.speedyAdapter;
            default:
                throw new common_1.BadRequestException(`Unsupported delivery method: ${deliveryMethod}`);
        }
    }
};
exports.ShippingProviderFactory = ShippingProviderFactory;
exports.ShippingProviderFactory = ShippingProviderFactory = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [econt_shipping_adapter_1.EcontShippingAdapter,
        speedy_shipping_adapter_1.SpeedyShippingAdapter])
], ShippingProviderFactory);
//# sourceMappingURL=shipping-provider.factory.js.map
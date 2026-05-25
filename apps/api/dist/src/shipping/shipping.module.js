"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShippingModule = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const econt_shipping_adapter_1 = require("./adapters/econt-shipping.adapter");
const speedy_shipping_adapter_1 = require("./adapters/speedy-shipping.adapter");
const shipping_provider_factory_1 = require("./factories/shipping-provider.factory");
const shipping_engine_service_1 = require("./services/shipping-engine.service");
const ahipping_controller_1 = require("./ahipping.controller");
let ShippingModule = class ShippingModule {
};
exports.ShippingModule = ShippingModule;
exports.ShippingModule = ShippingModule = __decorate([
    (0, common_1.Module)({
        imports: [axios_1.HttpModule],
        providers: [
            econt_shipping_adapter_1.EcontShippingAdapter,
            speedy_shipping_adapter_1.SpeedyShippingAdapter,
            shipping_provider_factory_1.ShippingProviderFactory,
            shipping_engine_service_1.ShippingEngineService,
        ],
        controllers: [ahipping_controller_1.ShippingController],
        exports: [shipping_engine_service_1.ShippingEngineService],
    })
], ShippingModule);
//# sourceMappingURL=shipping.module.js.map
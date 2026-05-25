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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShippingController = void 0;
const common_1 = require("@nestjs/common");
const shipping_engine_service_1 = require("./services/shipping-engine.service");
const shared_types_1 = require("@repo/shared-types");
let ShippingController = class ShippingController {
    shippingEngine;
    constructor(shippingEngine) {
        this.shippingEngine = shippingEngine;
    }
    async getCities(courier, countryCode) {
        if (!courier)
            throw new common_1.BadRequestException('Courier is required');
        return this.shippingEngine.getCities(courier, countryCode);
    }
    async getOffices(courier, cityId) {
        if (!courier)
            throw new common_1.BadRequestException('Courier is required');
        return this.shippingEngine.getOffices(courier, cityId);
    }
};
exports.ShippingController = ShippingController;
__decorate([
    (0, common_1.Get)('cities'),
    __param(0, (0, common_1.Query)('courier')),
    __param(1, (0, common_1.Query)('countryCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ShippingController.prototype, "getCities", null);
__decorate([
    (0, common_1.Get)('offices'),
    __param(0, (0, common_1.Query)('courier')),
    __param(1, (0, common_1.Query)('cityId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ShippingController.prototype, "getOffices", null);
exports.ShippingController = ShippingController = __decorate([
    (0, common_1.Controller)('shipping'),
    __metadata("design:paramtypes", [shipping_engine_service_1.ShippingEngineService])
], ShippingController);
//# sourceMappingURL=ahipping.controller.js.map
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
const calculate_shipping_use_case_1 = require("./use-cases/calculate-shipping.use-case");
const validate_address_use_case_1 = require("./use-cases/validate-address.use-case");
const create_waybill_use_case_1 = require("./use-cases/create-waybill.use-case");
const calculate_shipping_dto_1 = require("./dto/calculate-shipping.dto");
const validate_address_dto_1 = require("./dto/validate-address.dto");
const create_waybill_dto_1 = require("./dto/create-waybill.dto");
const shared_types_1 = require("@repo/shared-types");
let ShippingController = class ShippingController {
    shippingEngine;
    calculateShippingUseCase;
    validateAddressUseCase;
    createWaybillUseCase;
    constructor(shippingEngine, calculateShippingUseCase, validateAddressUseCase, createWaybillUseCase) {
        this.shippingEngine = shippingEngine;
        this.calculateShippingUseCase = calculateShippingUseCase;
        this.validateAddressUseCase = validateAddressUseCase;
        this.createWaybillUseCase = createWaybillUseCase;
    }
    async getCities(courier, countryCode, search) {
        if (!courier)
            throw new common_1.BadRequestException('Courier is required');
        return this.shippingEngine.getCities(courier, countryCode, search);
    }
    async getOffices(courier, cityId) {
        if (!courier)
            throw new common_1.BadRequestException('Courier is required');
        return this.shippingEngine.getOffices(courier, cityId);
    }
    async calculateShipping(dto) {
        return this.calculateShippingUseCase.execute(dto);
    }
    async validateAddress(dto) {
        return this.validateAddressUseCase.execute(dto);
    }
    async createWaybill(dto) {
        return this.createWaybillUseCase.execute(dto);
    }
};
exports.ShippingController = ShippingController;
__decorate([
    (0, common_1.Get)('cities'),
    __param(0, (0, common_1.Query)('courier')),
    __param(1, (0, common_1.Query)('countryCode')),
    __param(2, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
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
__decorate([
    (0, common_1.Post)('calculate'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [calculate_shipping_dto_1.CalculateShippingDto]),
    __metadata("design:returntype", Promise)
], ShippingController.prototype, "calculateShipping", null);
__decorate([
    (0, common_1.Post)('validate-address'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [validate_address_dto_1.ValidateAddressDto]),
    __metadata("design:returntype", Promise)
], ShippingController.prototype, "validateAddress", null);
__decorate([
    (0, common_1.Post)('waybill'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_waybill_dto_1.CreateWaybillDto]),
    __metadata("design:returntype", Promise)
], ShippingController.prototype, "createWaybill", null);
exports.ShippingController = ShippingController = __decorate([
    (0, common_1.Controller)('shipping'),
    __metadata("design:paramtypes", [shipping_engine_service_1.ShippingEngineService,
        calculate_shipping_use_case_1.CalculateShippingUseCase,
        validate_address_use_case_1.ValidateAddressUseCase,
        create_waybill_use_case_1.CreateWaybillUseCase])
], ShippingController);
//# sourceMappingURL=shipping.controller.js.map
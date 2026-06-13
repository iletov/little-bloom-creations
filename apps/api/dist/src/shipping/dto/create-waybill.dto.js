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
exports.CreateWaybillDto = exports.ReceiptItemDto = exports.SenderInfoDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const calculate_shipping_dto_1 = require("./calculate-shipping.dto");
class SenderInfoDto {
    name;
    phone;
    email;
}
exports.SenderInfoDto = SenderInfoDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SenderInfoDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SenderInfoDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SenderInfoDto.prototype, "email", void 0);
class ReceiptItemDto {
    name;
    price;
    quantity;
}
exports.ReceiptItemDto = ReceiptItemDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReceiptItemDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ReceiptItemDto.prototype, "price", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ReceiptItemDto.prototype, "quantity", void 0);
class CreateWaybillDto extends calculate_shipping_dto_1.CalculateShippingDto {
    senderInfo;
    shipmentDescription;
    receiptItems;
}
exports.CreateWaybillDto = CreateWaybillDto;
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => SenderInfoDto),
    __metadata("design:type", SenderInfoDto)
], CreateWaybillDto.prototype, "senderInfo", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateWaybillDto.prototype, "shipmentDescription", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ReceiptItemDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateWaybillDto.prototype, "receiptItems", void 0);
//# sourceMappingURL=create-waybill.dto.js.map
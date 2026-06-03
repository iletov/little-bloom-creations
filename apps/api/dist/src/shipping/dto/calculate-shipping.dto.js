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
exports.CalculateShippingDto = exports.RecipientInfoDto = exports.ParcelDimensionsDto = exports.AddressDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const shared_types_1 = require("@repo/shared-types");
class AddressDto {
    city;
    postalCode;
    street;
    streetNumber;
    quarter;
    other;
    siteId;
    streetId;
    blockNo;
    entranceNo;
    floorNo;
    apartmentNo;
}
exports.AddressDto = AddressDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddressDto.prototype, "city", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AddressDto.prototype, "postalCode", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AddressDto.prototype, "street", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AddressDto.prototype, "streetNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AddressDto.prototype, "quarter", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AddressDto.prototype, "other", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], AddressDto.prototype, "siteId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], AddressDto.prototype, "streetId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AddressDto.prototype, "blockNo", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AddressDto.prototype, "entranceNo", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AddressDto.prototype, "floorNo", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AddressDto.prototype, "apartmentNo", void 0);
class ParcelDimensionsDto {
    seqNo;
    weight;
    width;
    height;
    depth;
    ref1;
}
exports.ParcelDimensionsDto = ParcelDimensionsDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ParcelDimensionsDto.prototype, "seqNo", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ParcelDimensionsDto.prototype, "weight", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ParcelDimensionsDto.prototype, "width", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ParcelDimensionsDto.prototype, "height", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ParcelDimensionsDto.prototype, "depth", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ParcelDimensionsDto.prototype, "ref1", void 0);
class RecipientInfoDto {
    firstName;
    lastName;
    phone;
    email;
    officeId;
    clientName;
}
exports.RecipientInfoDto = RecipientInfoDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecipientInfoDto.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecipientInfoDto.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecipientInfoDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RecipientInfoDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], RecipientInfoDto.prototype, "officeId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RecipientInfoDto.prototype, "clientName", void 0);
class CalculateShippingDto {
    deliveryMethod;
    paymentMethod = null;
    totalWeight;
    totalAmount;
    recipientAddress;
    recipientInfo;
    parcels;
    senderAddress;
}
exports.CalculateShippingDto = CalculateShippingDto;
__decorate([
    (0, class_validator_1.IsEnum)(shared_types_1.DeliveryMethodEnum),
    __metadata("design:type", String)
], CalculateShippingDto.prototype, "deliveryMethod", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(shared_types_1.PaymentMethodEnum),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CalculateShippingDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CalculateShippingDto.prototype, "totalWeight", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CalculateShippingDto.prototype, "totalAmount", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => AddressDto),
    __metadata("design:type", AddressDto)
], CalculateShippingDto.prototype, "recipientAddress", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => RecipientInfoDto),
    __metadata("design:type", RecipientInfoDto)
], CalculateShippingDto.prototype, "recipientInfo", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ParcelDimensionsDto),
    __metadata("design:type", Array)
], CalculateShippingDto.prototype, "parcels", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => AddressDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", AddressDto)
], CalculateShippingDto.prototype, "senderAddress", void 0);
//# sourceMappingURL=calculate-shipping.dto.js.map
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
exports.PlaceCashOrderDto = exports.OrderRecipientDto = exports.OrderAddressDto = exports.OrderItemDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const shared_types_1 = require("@repo/shared-types");
class OrderItemDto {
    sku;
    variantSku;
    name;
    variantName;
    quantity;
    unitPrice;
    weight;
    personalization;
}
exports.OrderItemDto = OrderItemDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OrderItemDto.prototype, "sku", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], OrderItemDto.prototype, "variantSku", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OrderItemDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], OrderItemDto.prototype, "variantName", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], OrderItemDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], OrderItemDto.prototype, "unitPrice", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], OrderItemDto.prototype, "weight", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], OrderItemDto.prototype, "personalization", void 0);
class OrderAddressDto {
    city;
    postalCode;
    street;
    streetNumber;
    quarter;
    siteId;
    country;
}
exports.OrderAddressDto = OrderAddressDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OrderAddressDto.prototype, "city", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], OrderAddressDto.prototype, "postalCode", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], OrderAddressDto.prototype, "street", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], OrderAddressDto.prototype, "streetNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], OrderAddressDto.prototype, "quarter", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], OrderAddressDto.prototype, "siteId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], OrderAddressDto.prototype, "country", void 0);
class OrderRecipientDto {
    firstName;
    lastName;
    phone;
    email;
    officeId;
}
exports.OrderRecipientDto = OrderRecipientDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OrderRecipientDto.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OrderRecipientDto.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OrderRecipientDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], OrderRecipientDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], OrderRecipientDto.prototype, "officeId", void 0);
class PlaceCashOrderDto {
    items;
    recipientAddress;
    recipientInfo;
    deliveryMethod;
    totalAmount;
    deliveryCost;
    totalWeight;
    shipmentDescription;
}
exports.PlaceCashOrderDto = PlaceCashOrderDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => OrderItemDto),
    __metadata("design:type", Array)
], PlaceCashOrderDto.prototype, "items", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => OrderAddressDto),
    __metadata("design:type", OrderAddressDto)
], PlaceCashOrderDto.prototype, "recipientAddress", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => OrderRecipientDto),
    __metadata("design:type", OrderRecipientDto)
], PlaceCashOrderDto.prototype, "recipientInfo", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(shared_types_1.DeliveryMethodEnum),
    __metadata("design:type", String)
], PlaceCashOrderDto.prototype, "deliveryMethod", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], PlaceCashOrderDto.prototype, "totalAmount", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], PlaceCashOrderDto.prototype, "deliveryCost", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], PlaceCashOrderDto.prototype, "totalWeight", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PlaceCashOrderDto.prototype, "shipmentDescription", void 0);
//# sourceMappingURL=place-cash-order.dto.js.map
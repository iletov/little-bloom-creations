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
exports.CancelStripeOrderUseCase = void 0;
const common_1 = require("@nestjs/common");
const stripe_service_1 = require("../../stripe/stripe.service");
let CancelStripeOrderUseCase = class CancelStripeOrderUseCase {
    stripeService;
    constructor(stripeService) {
        this.stripeService = stripeService;
    }
    async execute(dto) {
        return this.stripeService.cancelPayment(dto.paymentIntentId, dto.reason);
    }
};
exports.CancelStripeOrderUseCase = CancelStripeOrderUseCase;
exports.CancelStripeOrderUseCase = CancelStripeOrderUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [stripe_service_1.StripeService])
], CancelStripeOrderUseCase);
//# sourceMappingURL=cancel-stripe-order.use-case.js.map
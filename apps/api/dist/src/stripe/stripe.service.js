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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const stripe_1 = __importDefault(require("stripe"));
let StripeService = class StripeService {
    configService;
    stripe;
    webhookSecret;
    constructor(configService) {
        this.configService = configService;
        const secretKey = this.configService.get('STRIPE_SECRET_KEY') || '';
        this.webhookSecret =
            this.configService.get('STRIPE_WEBHOOK_SECRET') || '';
        if (!secretKey) {
            console.warn('⚠️ ПРЕДУПРЕЖДЕНИЕ: STRIPE_SECRET_KEY липсва в .env файла!');
        }
        this.stripe = new stripe_1.default(secretKey, {
            apiVersion: '2025-01-27.acacia',
        });
    }
    async createPaymentIntent(amount, metadata, email) {
        return this.stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency: 'eur',
            automatic_payment_methods: { enabled: true },
            metadata,
            receipt_email: email,
        });
    }
    constructEvent(payload, signature) {
        return this.stripe.webhooks.constructEvent(payload, signature, this.webhookSecret);
    }
    async refundPayment(paymentIntentId, reason) {
        return this.stripe.refunds.create({
            payment_intent: paymentIntentId,
            metadata: { reason },
        });
    }
};
exports.StripeService = StripeService;
exports.StripeService = StripeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], StripeService);
//# sourceMappingURL=stripe.service.js.map
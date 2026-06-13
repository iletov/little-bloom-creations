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
exports.SanityWebhooksController = void 0;
const common_1 = require("@nestjs/common");
const sync_sanity_product_use_case_1 = require("./use-cases/sync-sanity-product.use-case");
let SanityWebhooksController = class SanityWebhooksController {
    syncSanityProductUseCase;
    constructor(syncSanityProductUseCase) {
        this.syncSanityProductUseCase = syncSanityProductUseCase;
    }
    async handleWebhook(signature, payload) {
        if (!signature) {
            throw new common_1.UnauthorizedException('Missing signature');
        }
        if (!payload || !payload.sku) {
            return { success: true, message: 'Ignored missing payload or sku' };
        }
        const eventType = payload._type;
        const operation = payload.operation || 'update';
        try {
            const operationType = payload.operation || (payload._deleted ? 'delete' : 'update');
            await this.syncSanityProductUseCase.execute(operationType, payload);
            return { success: true, message: 'Sanity Webhook Processed' };
        }
        catch (error) {
            console.error('Sanity webhook processing error:', error);
            throw error;
        }
    }
};
exports.SanityWebhooksController = SanityWebhooksController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Headers)('sanity-webhook-signature')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SanityWebhooksController.prototype, "handleWebhook", null);
exports.SanityWebhooksController = SanityWebhooksController = __decorate([
    (0, common_1.Controller)('webhooks/sanity'),
    __metadata("design:paramtypes", [sync_sanity_product_use_case_1.SyncSanityProductUseCase])
], SanityWebhooksController);
//# sourceMappingURL=sanity-webhooks.controller.js.map
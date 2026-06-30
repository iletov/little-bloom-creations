"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SanityModule = void 0;
const common_1 = require("@nestjs/common");
const sanity_webhooks_controller_1 = require("./sanity-webhooks.controller");
const sanity_controller_1 = require("./sanity.controller");
const sync_sanity_product_use_case_1 = require("./use-cases/sync-sanity-product.use-case");
const get_sanity_sender_info_use_case_1 = require("./use-cases/get-sanity-sender-info.use-case");
const products_module_1 = require("../products/products.module");
let SanityModule = class SanityModule {
};
exports.SanityModule = SanityModule;
exports.SanityModule = SanityModule = __decorate([
    (0, common_1.Module)({
        imports: [products_module_1.ProductsModule],
        controllers: [sanity_webhooks_controller_1.SanityWebhooksController, sanity_controller_1.SanityController],
        providers: [sync_sanity_product_use_case_1.SyncSanityProductUseCase, get_sanity_sender_info_use_case_1.GetSanitySenderInfoUseCase],
        exports: [get_sanity_sender_info_use_case_1.GetSanitySenderInfoUseCase],
    })
], SanityModule);
//# sourceMappingURL=sanity.module.js.map
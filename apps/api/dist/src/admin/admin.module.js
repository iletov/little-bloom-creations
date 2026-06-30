"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const admin_controller_1 = require("./admin.controller");
const metrics_service_1 = require("./metrics.service");
const admin_orders_service_1 = require("./admin-orders.service");
const admin_waybill_service_1 = require("./admin-waybill.service");
const admin_cancellation_service_1 = require("./admin-cancellation.service");
const admin_repository_1 = require("./admin.repository");
const stripe_module_1 = require("../stripe/stripe.module");
const sanity_module_1 = require("../sanity/sanity.module");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [stripe_module_1.StripeModule, sanity_module_1.SanityModule],
        controllers: [admin_controller_1.AdminController],
        providers: [
            admin_repository_1.AdminRepository,
            metrics_service_1.MetricsService,
            admin_orders_service_1.AdminOrdersService,
            admin_waybill_service_1.AdminWaybillService,
            admin_cancellation_service_1.AdminCancellationService
        ],
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map
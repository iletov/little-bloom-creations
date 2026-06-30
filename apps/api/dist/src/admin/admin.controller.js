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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const metrics_service_1 = require("./metrics.service");
const admin_orders_service_1 = require("./admin-orders.service");
const admin_waybill_service_1 = require("./admin-waybill.service");
const admin_cancellation_service_1 = require("./admin-cancellation.service");
const supabase_auth_guard_1 = require("../common/guards/supabase-auth.guard");
let AdminController = class AdminController {
    metricsService;
    adminOrdersService;
    adminWaybillService;
    adminCancellationService;
    constructor(metricsService, adminOrdersService, adminWaybillService, adminCancellationService) {
        this.metricsService = metricsService;
        this.adminOrdersService = adminOrdersService;
        this.adminWaybillService = adminWaybillService;
        this.adminCancellationService = adminCancellationService;
    }
    async getMetrics(days) {
        const daysNum = days ? parseInt(days, 10) : 7;
        return this.metricsService.getMetrics(isNaN(daysNum) ? 7 : daysNum);
    }
    async getAllOrders() {
        return this.adminOrdersService.getAllOrders();
    }
    async getSingleOrder(orderNumber) {
        return this.adminOrdersService.getSingleOrder(orderNumber);
    }
    async updateOrder(id, updates) {
        return this.adminOrdersService.updateOrder(id, updates);
    }
    async generateWaybill(id) {
        return this.adminWaybillService.generateWaybill(id);
    }
    async cancelOrder(id) {
        return this.adminCancellationService.cancelOrder(id);
    }
    async markAsDelivered(id) {
        return this.adminOrdersService.markAsDelivered(id);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('metrics'),
    __param(0, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getMetrics", null);
__decorate([
    (0, common_1.Get)('orders'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllOrders", null);
__decorate([
    (0, common_1.Get)('orders/:orderNumber'),
    __param(0, (0, common_1.Param)('orderNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getSingleOrder", null);
__decorate([
    (0, common_1.Patch)('orders/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateOrder", null);
__decorate([
    (0, common_1.Post)('orders/:id/waybill'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "generateWaybill", null);
__decorate([
    (0, common_1.Post)('orders/:id/cancel'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "cancelOrder", null);
__decorate([
    (0, common_1.Post)('orders/:id/deliver'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "markAsDelivered", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.UseGuards)(supabase_auth_guard_1.SupabaseAuthGuard),
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [metrics_service_1.MetricsService,
        admin_orders_service_1.AdminOrdersService,
        admin_waybill_service_1.AdminWaybillService,
        admin_cancellation_service_1.AdminCancellationService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map
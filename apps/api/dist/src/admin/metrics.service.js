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
exports.MetricsService = void 0;
const common_1 = require("@nestjs/common");
const admin_repository_1 = require("./admin.repository");
let MetricsService = class MetricsService {
    adminRepository;
    constructor(adminRepository) {
        this.adminRepository = adminRepository;
    }
    async getMetrics(days = 7) {
        const chartStartDate = new Date();
        chartStartDate.setHours(0, 0, 0, 0);
        chartStartDate.setDate(chartStartDate.getDate() - days + 1);
        const { todayStats, allStats, pendingStats, productsCountResult, variantsCountResult, chartStats, deliveryStats, } = await this.adminRepository.getMetrics(chartStartDate, days);
        const todayRevenue = Number(todayStats?.revenue || 0).toFixed(2);
        const todayOrdersCount = Number(todayStats?.count || 0);
        const allRevenue = Number(allStats?.revenue || 0).toFixed(2);
        const pendingOrdersCount = Number(pendingStats?.count || 0);
        const totalProductsCount = Number(productsCountResult?.count || 0) + Number(variantsCountResult?.count || 0);
        const chartData = [];
        for (let i = 0; i < days; i++) {
            const d = new Date(chartStartDate);
            d.setDate(d.getDate() + i);
            const dateStr = d.toISOString().split('T')[0];
            const found = chartStats.find((s) => String(s.date) === dateStr);
            chartData.push({
                date: dateStr,
                revenue: found ? Number(found.revenue) : 0,
            });
        }
        let speedyCount = 0;
        let ekontCount = 0;
        deliveryStats.forEach((stat) => {
            const methodStr = String(stat.method).toLowerCase();
            if (methodStr.includes('speedy'))
                speedyCount += Number(stat.count);
            if (methodStr.includes('ekont'))
                ekontCount += Number(stat.count);
        });
        const deliveryChartData = [
            { name: 'Speedy', count: speedyCount, fill: '#ef4444' },
            { name: 'Econt', count: ekontCount, fill: '#3b82f6' },
        ];
        return {
            todayRevenue,
            todayOrdersCount,
            pendingOrdersCount,
            productsCount: totalProductsCount,
            allRevenue,
            chartData,
            deliveryChartData,
        };
    }
};
exports.MetricsService = MetricsService;
exports.MetricsService = MetricsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [admin_repository_1.AdminRepository])
], MetricsService);
//# sourceMappingURL=metrics.service.js.map
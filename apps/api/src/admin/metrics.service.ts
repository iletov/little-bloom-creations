import { Injectable } from '@nestjs/common';
import { AdminRepository } from './admin.repository';

@Injectable()
export class MetricsService {
  constructor(private readonly adminRepository: AdminRepository) {}

  async getMetrics(days: number = 7) {
    const chartStartDate = new Date();
    chartStartDate.setHours(0, 0, 0, 0);
    chartStartDate.setDate(chartStartDate.getDate() - days + 1);

    const {
      todayStats,
      allStats,
      pendingStats,
      productsCountResult,
      variantsCountResult,
      chartStats,
      deliveryStats,
    } = await this.adminRepository.getMetrics(chartStartDate, days);

    const todayRevenue = Number(todayStats?.revenue || 0).toFixed(2);
    const todayOrdersCount = Number(todayStats?.count || 0);
    const allRevenue = Number(allStats?.revenue || 0).toFixed(2);
    const pendingOrdersCount = Number(pendingStats?.count || 0);
    const totalProductsCount = Number(productsCountResult?.count || 0) + Number(variantsCountResult?.count || 0);

    const chartData: { date: string; revenue: number }[] = [];
    for (let i = 0; i < days; i++) {
      const d = new Date(chartStartDate);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      
      const found = chartStats.find((s: any) => String(s.date) === dateStr);
      chartData.push({
        date: dateStr,
        revenue: found ? Number(found.revenue) : 0,
      });
    }

    let speedyCount = 0;
    let ekontCount = 0;

    deliveryStats.forEach((stat: any) => {
      const methodStr = String(stat.method).toLowerCase();
      if (methodStr.includes('speedy')) speedyCount += Number(stat.count);
      if (methodStr.includes('ekont')) ekontCount += Number(stat.count);
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
}

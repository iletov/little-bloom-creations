import { AdminRepository } from './admin.repository';
export declare class MetricsService {
    private readonly adminRepository;
    constructor(adminRepository: AdminRepository);
    getMetrics(days?: number): Promise<{
        todayRevenue: string;
        todayOrdersCount: number;
        pendingOrdersCount: number;
        productsCount: number;
        allRevenue: string;
        chartData: {
            date: string;
            revenue: number;
        }[];
        deliveryChartData: {
            name: string;
            count: number;
            fill: string;
        }[];
    }>;
}

import MetricsCards from '@/component/dashboard/metrics-cards/MetricsCards';
import RecentOrders from '@/component/dashboard/orders/RecentOrder';
import RevenueChartWrapper from '@/component/dashboard/revenue-chart/RevenueChartWrapper';
import React, { Suspense } from 'react';
import MetricsSkeleton from '@/component/dashboard/metrics-cards/MetricsSkeleton';
import ChartSkeleton from '@/component/dashboard/revenue-chart/ChartSkeleton';
import TableSkeleton from '@/component/dashboard/orders/TableSkeleton';

export default async function DashboardPage() {
  return (
    <div className="w-full min-h-svh pt-4 md:pt-8 pb-24 px-4 md:px-10 space-y-6 md:space-y-8 ">
      <Suspense fallback={<MetricsSkeleton />}>
        <MetricsCards />
      </Suspense>

      <Suspense fallback={<ChartSkeleton />}>
        <RevenueChartWrapper />
      </Suspense>

      <Suspense fallback={<TableSkeleton />}>
        <RecentOrders />
      </Suspense>
    </div>
  );
}

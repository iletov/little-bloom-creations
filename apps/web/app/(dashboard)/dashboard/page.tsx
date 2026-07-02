import MetricsCards from '@/component/dashboard/metrics-cards/MetricsCards';
import RecentOrders from '@/component/dashboard/orders/RecentOrder';
import RevenueChart from '@/component/dashboard/revenue-chart/RevenueChart';
import { getMetrics } from '@/supabase/dashboard/getMetrics';
import React, { Suspense } from 'react';
import MetricsSkeleton from '@/component/dashboard/metrics-cards/MetricsSkeleton';
import ChartSkeleton from '@/component/dashboard/revenue-chart/ChartSkeleton';
import TableSkeleton from '@/component/dashboard/orders/TableSkeleton';

export default async function DashboardPage() {
  const metrics = await getMetrics();
  return (
    <div className="w-full min-h-svh pt-4 md:pt-8 pb-24 px-4 md:px-10 space-y-6 md:space-y-8 ">
      <Suspense fallback={<MetricsSkeleton />}>
        <MetricsCards metrics={metrics} />
      </Suspense>

      <Suspense fallback={<ChartSkeleton />}>
        <RevenueChart initialMetrics={metrics} />
      </Suspense>

      <Suspense fallback={<TableSkeleton />}>
        <RecentOrders />
      </Suspense>
    </div>
  );
}

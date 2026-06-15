import React from 'react';
import MetricsSkeleton from '@/component/dashboard/metrics-cards/MetricsSkeleton';
import ChartSkeleton from '@/component/dashboard/revenue-chart/ChartSkeleton';
import TableSkeleton from '@/component/dashboard/orders/TableSkeleton';

export default function DashboardLoading() {
  return (
    <div className="w-full h-svh py-8 px-10 space-y-8 ">
      <MetricsSkeleton />
      <ChartSkeleton />
      <TableSkeleton />
    </div>
  );
}

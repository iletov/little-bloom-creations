import MetricsCards from '@/component/dashboard/metrics-cards/MetricsCards';
import RecentOrders from '@/component/dashboard/orders/RecentOrder';
import { getMetrics } from '@/supabase/dashboard/getMetrics';
import React, { Suspense } from 'react';

export default async function DashboardPage() {
  const metrics = await getMetrics();
  return (
    <div className="w-full h-svh py-8 px-10 space-y-8 ">
      <div className="flex flex-col-reverse">
        <h1 className="text-[2.2rem] font-[500]">{metrics?.allRevenue} €</h1>
        <p className="text-gray-400">Total Revenue</p>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <MetricsCards metrics={metrics} />
      </Suspense>

      <Suspense fallback={<div>Loading...</div>}>
        <RecentOrders />
      </Suspense>
    </div>
  );
}

import MetricsCards from '@/component/dashboard/metrics-cards/MetricsCards';
import RecentOrders from '@/component/dashboard/orders/RecentOrder';
import React, { Suspense } from 'react';

export default function DashboardPage() {
  return (
    <div className="w-full h-svh py-4 px-6 space-y-8">
      <div>
        <h1 className="text-[2.4rem] font-semibold">Dashboard</h1>
        <p className="text-gray-500">Welcome back!</p>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <MetricsCards />
      </Suspense>

      <Suspense fallback={<div>Loading...</div>}>
        <RecentOrders />
      </Suspense>
    </div>
  );
}

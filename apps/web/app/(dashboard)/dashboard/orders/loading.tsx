import React from 'react';
import TableSkeleton from '@/component/dashboard/orders/TableSkeleton';

export default function OrdersLoading() {
  return (
    <div className="w-full h-svh py-4 px-10 space-y-8">
      {/* Page Header Skeleton */}
      <div>
        <h1 className="text-[2.8rem] font-[500] text-[#d78aec]">Orders</h1>
        <p className="text-gray-100">Manage and track all customer orders</p>
      </div>

      <TableSkeleton />
    </div>
  );
}

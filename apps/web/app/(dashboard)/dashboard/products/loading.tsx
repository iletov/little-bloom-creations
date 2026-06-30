import React from 'react';
import TableSkeleton from '@/component/dashboard/orders/TableSkeleton';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductsLoading() {
  return (
    <div className="w-full h-svh py-4 px-10 space-y-8">
      {/* Page Header Skeleton */}
      <h1 className="text-[2.8rem] font-[500] text-orange-400">Products</h1>

      <div className="w-full min-h-[80svh] bg-gray-700 rounded-lg p-6 space-y-6">
        {/* Stats Cards Skeleton */}
        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-[#20212b] rounded-xl border border-slate-700/50 p-6 flex flex-col justify-between h-[120px]">
              <Skeleton className="h-4 w-32 bg-slate-700/50 rounded-md" />
              <Skeleton className="h-12 w-24 bg-slate-700/50 rounded-md mt-4" />
            </div>
          ))}
        </div>

        <TableSkeleton />
      </div>
    </div>
  );
}

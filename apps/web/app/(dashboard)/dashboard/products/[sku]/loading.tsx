import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductDetailLoading() {
  return (
    <div className="w-full h-svh py-8 px-10 space-y-8">
      <Skeleton className="h-10 w-64 bg-slate-700/50 rounded-md" />
      <div className="bg-[#20212b] rounded-xl border border-slate-700/50 p-6 h-[400px]">
        <Skeleton className="h-full w-full bg-slate-700/30 rounded-md" />
      </div>
    </div>
  );
}

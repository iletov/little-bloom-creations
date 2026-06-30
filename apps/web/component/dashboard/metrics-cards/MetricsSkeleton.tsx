'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function MetricsSkeleton() {
  return (
    <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4 w-full">
      {[...Array(4)].map((_, i) => (
        <div 
          key={i} 
          className="bg-[#20212b] rounded-xl border border-slate-700/50 p-6 flex flex-col justify-between h-[150px]"
        >
          <div className="flex justify-between items-start">
            <Skeleton className="h-6 w-32 bg-slate-700/50 rounded-md" />
            <Skeleton className="h-10 w-10 bg-slate-700/50 rounded-full" />
          </div>
          <div>
            <Skeleton className="h-12 w-48 bg-slate-700/50 rounded-md mt-4" />
          </div>
        </div>
      ))}
    </div>
  );
}

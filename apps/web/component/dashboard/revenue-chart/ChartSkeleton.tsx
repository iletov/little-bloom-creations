'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ChartSkeleton() {
  return (
    <div className="w-full mt-8 flex flex-col gap-4">
      {/* Controls Skeleton */}
      <div className="flex justify-end items-center mb-2">
        <Skeleton className="h-10 w-48 bg-slate-700/50 rounded-md" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart Skeleton */}
        <div className="lg:col-span-2 bg-[#20212b] rounded-xl border border-slate-700/50 p-6 h-[350px] flex flex-col">
          <Skeleton className="h-8 w-64 bg-slate-700/50 rounded-md mb-8" />
          <div className="flex-1 flex items-end gap-4">
            {[...Array(7)].map((_, i) => (
              <Skeleton 
                key={`rev-${i}`} 
                className="w-full bg-slate-700/30 rounded-t-md" 
                style={{ height: `${Math.floor(Math.random() * 60) + 20}%` }} 
              />
            ))}
          </div>
        </div>

        {/* Delivery Chart Skeleton */}
        <div className="lg:col-span-1 bg-[#20212b] rounded-xl border border-slate-700/50 p-6 h-[350px] flex flex-col">
          <Skeleton className="h-8 w-48 bg-slate-700/50 rounded-md mb-8" />
          <div className="flex-1 flex flex-col justify-around">
            <Skeleton className="h-12 w-[80%] bg-slate-700/30 rounded-md" />
            <Skeleton className="h-12 w-[60%] bg-slate-700/30 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}

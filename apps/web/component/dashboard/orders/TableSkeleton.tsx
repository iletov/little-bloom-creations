'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function TableSkeleton() {
  return (
    <div className="w-full bg-[#20212b] rounded-xl border border-slate-700/50 p-6 mt-8">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-8 w-48 bg-slate-700/50 rounded-md" />
        <Skeleton className="h-10 w-32 bg-slate-700/50 rounded-md" />
      </div>

      <div className="w-full border border-slate-700/50 rounded-lg overflow-hidden">
        {/* Table Header */}
        <div className="bg-[#1a1b23] border-b border-slate-700/50 p-4 grid grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={`th-${i}`} className="h-6 w-full bg-slate-700/40 rounded-md" />
          ))}
        </div>

        {/* Table Rows */}
        <div className="flex flex-col">
          {[...Array(5)].map((_, rowIndex) => (
            <div 
              key={`tr-${rowIndex}`} 
              className="p-4 grid grid-cols-6 gap-4 border-b border-slate-700/30 last:border-0 items-center"
            >
              {[...Array(6)].map((_, colIndex) => (
                <Skeleton 
                  key={`td-${rowIndex}-${colIndex}`} 
                  className={`h-8 bg-slate-700/30 rounded-md ${
                    colIndex === 0 ? 'w-24' : 
                    colIndex === 5 ? 'w-16 ml-auto' : 
                    'w-[80%]'
                  }`} 
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

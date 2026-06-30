import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SingleOrderLoading() {
  return (
    <section className="max-w-[1600px] p-10 space-y-8">
      {/* Header */}
      <div className="flex items-center w-full gap-6">
        <Button variant="outline" size="icon" className="w-12 h-12 rounded-full border-slate-700 bg-[#20212b]" disabled>
          <ChevronLeft size={16} className="text-slate-400" />
        </Button>
        <h1 className="text-[2.4rem] font-semibold text-slate-200">Order Information</h1>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Order Details & Shipping) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Order Details Card */}
          <div className="bg-[#20212b] rounded-xl border border-slate-700/50 p-6 space-y-6">
            <Skeleton className="h-8 w-48 bg-slate-700/50 rounded-md" />
            <div className="grid grid-cols-2 gap-y-6 gap-x-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24 bg-slate-700/30 rounded-md" />
                  <Skeleton className="h-6 w-40 bg-slate-700/50 rounded-md" />
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address Card */}
          <div className="bg-[#20212b] rounded-xl border border-slate-700/50 p-6 space-y-6">
            <Skeleton className="h-8 w-40 bg-slate-700/50 rounded-md" />
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className={`h-4 bg-slate-700/40 rounded-md ${i === 2 ? 'w-1/2' : 'w-3/4'}`} />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Items & Summary) */}
        <div className="lg:col-span-1 space-y-8">
          {/* Order Items Card */}
          <div className="bg-[#20212b] rounded-xl border border-slate-700/50 p-6 space-y-6">
            <Skeleton className="h-8 w-32 bg-slate-700/50 rounded-md" />
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-4 items-center">
                  <Skeleton className="h-16 w-16 bg-slate-700/50 rounded-md flex-shrink-0" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-full bg-slate-700/40 rounded-md" />
                    <Skeleton className="h-4 w-24 bg-slate-700/30 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Summary Card */}
          <div className="bg-[#20212b] rounded-xl border border-slate-700/50 p-6 space-y-4">
            <Skeleton className="h-8 w-32 bg-slate-700/50 rounded-md mb-6" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <Skeleton className="h-4 w-24 bg-slate-700/30 rounded-md" />
                <Skeleton className="h-4 w-16 bg-slate-700/40 rounded-md" />
              </div>
            ))}
            <div className="pt-4 mt-4 border-t border-slate-700/50 flex justify-between items-center">
              <Skeleton className="h-6 w-16 bg-slate-700/50 rounded-md" />
              <Skeleton className="h-6 w-24 bg-slate-700/50 rounded-md" />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

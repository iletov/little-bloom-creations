'use client';

import React, { useState, useEffect } from 'react';
import { getMetrics } from '@/supabase/dashboard/getMetrics';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from 'recharts';
import DeliveryChart from './DeliveryChart';

export default function RevenueChart({ initialMetrics }: { initialMetrics: any }) {
  const [days, setDays] = useState<number>(7);
  const [data, setData] = useState<any[]>(initialMetrics?.chartData || []);
  const [deliveryData, setDeliveryData] = useState<any[]>(initialMetrics?.deliveryChartData || []);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const metrics = await getMetrics(days);
        if (isMounted && metrics) {
          if (metrics.chartData) setData(metrics.chartData);
          if (metrics.deliveryChartData) setDeliveryData(metrics.deliveryChartData);
        }
      } catch (error) {
        console.error('Failed to fetch chart data:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    // Skip fetch on first mount if we have initialData for exactly 7 days
    if (days === 7 && initialMetrics?.chartData?.length === 7 && data.length > 0) {
      // already have data
    } else {
      fetchData();
    }

    return () => {
      isMounted = false;
    };
  }, [days, initialMetrics]);

  // Format date for tooltip and axis
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('bg-BG', { day: '2-digit', month: 'short' });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1a1c23] border border-slate-700 p-4 rounded-lg shadow-xl">
          <p className="text-slate-300 mb-2">{formatDate(label)}</p>
          <p className="text-green-400 font-bold text-[1.6rem]">
            {payload[0].value} €
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full mt-8 flex flex-col gap-4">
      {/* Controls */}
      <div className="flex justify-end items-center mb-2">
        <div className="flex items-center gap-3 relative">
          <span className="text-slate-400 text-[1.4rem]">Period:</span>
          <select 
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="bg-[#13141b] border border-slate-600 text-slate-200 text-[1.4rem] rounded-md px-4 py-2 focus:outline-none focus:border-green-500 cursor-pointer appearance-none pr-10"
          >
            <option value={7}>Last 7 days</option>
            <option value={14}>Last 14 days</option>
            <option value={30}>Last 30 days</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-[#20212b] rounded-xl border border-slate-700/50 p-6 h-full flex flex-col">
          <h2 className="text-[2.2rem] font-[600] text-[#f1f1f1] mb-8">
            Revenue Overview
          </h2>

      <div className="h-[250px] w-full relative">
        {loading && (
          <div className="absolute inset-0 z-10 bg-[#20212b]/60 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        )}
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: -20,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tickFormatter={formatDate}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              dx={-10}
              tickFormatter={(value) => `${value}€`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#334155', opacity: 0.4 }} />
            <Bar 
              dataKey="revenue" 
              fill="#10b981" 
              radius={[6, 6, 0, 0]}
              maxBarSize={40}
            >
              <LabelList 
                dataKey="revenue" 
                position="top" 
                fill="#94a3b8" 
                fontSize={12} 
                formatter={(value: any) => value > 0 ? `${value}€` : ''} 
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
          </div>
        </div>

        {/* Delivery Chart */}
        <div className="lg:col-span-1 h-full">
          <DeliveryChart data={deliveryData} loading={loading} />
        </div>
      </div>
    </div>
  );
}

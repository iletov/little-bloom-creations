'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts';

export default function DeliveryChart({
  data,
  loading,
}: {
  data: any[];
  loading: boolean;
}) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1a1c23] border border-slate-700 p-4 rounded-lg shadow-xl">
          <p className="text-slate-300 mb-2">{payload[0].payload.name}</p>
          <p className="text-white font-bold text-[1.6rem]">
            {payload[0].value} orders
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-[#20212b] rounded-xl border border-slate-700/50 p-6 h-full flex flex-col">
      <h2 className="text-[2.2rem] font-[600] text-[#f1f1f1] mb-8">
        Delivery Providers
      </h2>

      <div className="h-[180px] w-full relative flex-grow">
        {loading && (
          <div className="absolute inset-0 z-10 bg-[#20212b]/60 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        )}
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{
              top: 5,
              right: 20,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#334155" />
            <XAxis type="number" hide />
            <YAxis
              dataKey="name"
              type="category"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#f1f1f1', fontSize: 14, fontWeight: 500 }}
              width={70}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#334155', opacity: 0.4 }} />
            <Bar dataKey="count" radius={10} maxBarSize={12}>
              <LabelList dataKey="count" position="right" fill="#f1f1f1" fontSize={14} fontWeight={600} />
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

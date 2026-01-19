import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getMetrics } from '@/supabase/dashboard/getMetrics';
import {
  AlertCircle,
  Euro,
  Package,
  ShoppingCart,
  WatchIcon,
} from 'lucide-react';
import React from 'react';

async function MetricsCards({ metrics }: { metrics: any }) {
  // console.log('metrics', metrics);
  const cards = [
    {
      title: 'Today Revenue',
      value: metrics?.todayRevenue + ' €',
      icon: Euro,
      // color: 'text-green-600',
      bgColor: 'bg-gradient-to-r from-[#65a2fa] to-[#396aef]',
    },
    {
      title: 'Today Orders',
      value: metrics?.todayOrdersCount,
      icon: Package,
      // color: 'text-blue-600',
      bgColor: 'bg-gradient-to-r from-[#d441fc] to-[#aa2ef3]',
    },
    {
      title: 'Pending Orders',
      value: metrics?.pendingOrdersCount,
      icon: WatchIcon,
      // color: 'text-yellow-600',
      bgColor: 'bg-gradient-to-r from-[#ed5d7b] to-[#d65484]',
    },
    // {
    //   title: 'Total Products',
    //   value: metrics?.productsCount,
    //   icon: Package,
    //   color: 'text-purple-600',
    //   bgColor: 'bg-purple-50',
    // },
    // {
    //   title: 'Low Stock Items',
    //   value: metrics?.lowStockCount,
    //   icon: AlertCircle,
    //   color: 'text-red-600',
    //   bgColor: 'bg-red-50',
    // },
  ];

  return (
    <div className="grid gap-10 grid-cols-1 md:grid-cols-3">
      {cards?.map((card, index) => (
        <Card key={card.title} className={`pt-4 px-3 ${card.bgColor}`}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-[2.2rem] font-[600] text-[#f1f1f1]">
              {card.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between items-center">
            <div className={`p-2 rounded-[0.75rem]`}>
              <card.icon
                className={`h-28 w-28 rotate-[-25deg] opacity-40 stroke-[0.4px]`}
              />
            </div>
            <div className="text-[4.6rem] font-[500]">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default MetricsCards;

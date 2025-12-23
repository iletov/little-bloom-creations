import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getMetrics } from '@/supabase/dashboard/getMetrics';
import { AlertCircle, Euro, Package, ShoppingCart } from 'lucide-react';
import React from 'react';

async function MetricsCards() {
  const metrics = await getMetrics();

  console.log('metrics', metrics);

  const cards = [
    {
      title: 'Today Revenue',
      value: metrics?.todayRevenue + ' €',
      icon: Euro,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Today Orders',
      value: metrics?.todayOrdersCount,
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Pending Orders',
      value: metrics?.pendingOrdersCount,
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Products',
      value: metrics?.productsCount,
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Low Stock Items',
      value: metrics?.lowStockCount,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg2:grid-cols-4 xl:grid-cols-5">
      {cards?.map((card, index) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-[1.8rem] font-[600] text-gray-600">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-[0.75rem] ${card.bgColor}`}>
              <card.icon className={`h-10 w-10 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-[2.4rem] font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default MetricsCards;

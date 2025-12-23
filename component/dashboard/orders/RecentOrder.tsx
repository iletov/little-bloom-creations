import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getOrders } from '@/supabase/dashboard/getOrders';
import Link from 'next/link';
import React from 'react';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
};

const deliveryMethodColors: Record<string, string> = {
  ekont: 'bg-blue-100 text-blue-800',
  speedy: 'bg-red-100 text-red-800',
};

async function RecentOrders() {
  const orders = await getOrders();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-[2rem]">Recent Orders</CardTitle>
          <Link
            href="/dashboard/orders"
            className="text-[1.4rem]  text-blue-600 hover:text-blue-700">
            View all →
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <p className="text-center text-gray-500 py-8 text-[1.6rem]">
            No orders yet
          </p>
        ) : (
          <section className="space-y-4">
            {orders.map((order: any) => (
              <Link
                key={order.order_number}
                href={`/dashboard/orders/${order.order_number}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors text-[1.6rem]">
                <div className="flex-1">
                  <div className="font-medium space-x-4">
                    {order.full_name} |{' '}
                    <span className="text-gray-500">
                      {order.email} | {order.order_number.slice(0, 8) + '...'}{' '}
                      {order.order_number.slice(-4)}
                    </span>
                    <Badge
                      className={deliveryMethodColors[order.delivery_method]}>
                      {order.delivery_method}
                    </Badge>
                  </div>
                  <p className="text-gray-400 mt-1">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-semibold">
                    {parseFloat(order.total_amount).toFixed(2)} BGN
                  </span>
                  <Badge className={statusColors[order.status] || ''}>
                    {order.status}
                  </Badge>
                </div>
              </Link>
            ))}
          </section>
        )}
      </CardContent>
    </Card>
  );
}

export default RecentOrders;

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { getOrders } from '@/supabase/dashboard/getOrders';
import Link from 'next/link';
import React from 'react';
import { columns } from './columns';

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
        <DataTable columns={columns} data={orders.recentOrders} />
      </CardContent>
    </Card>
  );
}

export default RecentOrders;

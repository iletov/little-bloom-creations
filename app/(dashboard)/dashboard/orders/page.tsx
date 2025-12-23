// app/(dashboard)/dashboard/orders/page.tsx
import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@supabase/supabase-js';
import { DataTable } from '@/components/ui/data-table';
import { columns } from '@/component/dashboard/orders/columns';
import { getOrders } from '@/supabase/dashboard/getOrders';

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div className="w-full h-svh py-8 px-10 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-gray-500">Manage and track all customer orders</p>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Orders ({orders.allOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={'Loading...'}>
            <DataTable columns={columns} data={orders.allOrders} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

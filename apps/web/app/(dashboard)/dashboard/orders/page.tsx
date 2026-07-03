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
    <div className="w-full min-h-svh pt-4 pb-24 px-4 md:px-10 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-[2.8rem] font-[500] text-[#d78aec]">Orders</h1>
        <p className="text-gray-100">Manage and track all customer orders</p>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Orders ({orders.allOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={'Loading...'}>
            <DataTable
              columns={columns}
              data={orders.allOrders}
              basePath="/dashboard/orders"
              idKey="order_number"
              exportFileName="Orders_Export"
            />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

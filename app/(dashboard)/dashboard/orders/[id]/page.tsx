import BackButton from '@/component/dashboard/back-button/BackButton';
import SingleOrderContainer from '@/component/dashboard/single-order/SingleOrderContainer';
import { Button } from '@/components/ui/button';
import {
  getOrders,
  getSingleOrder,
  getOrdersForStaticParams,
} from '@/supabase/dashboard/getOrders';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

// Revalidate this page every 60 seconds
export const revalidate = 60;

export async function generateStaticParams() {
  const orders = await getOrdersForStaticParams();
  return orders.map(order => ({
    id: order.order_number,
  }));
}

export default async function SingleOrder({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order = await getSingleOrder(id);

  if (!order) {
    return (
      <section className="max-w-[1600px] p-10 space-y-8">
        <Link href={{ pathname: '/dashboard/orders' }}>
          <Button
            variant="primery"
            size="icon"
            className="bg-[#FAFAFA] w-16 h-16">
            <ChevronLeft size={16} />
          </Button>
        </Link>
        <div className="text-center py-20">
          <h1 className="text-2xl font-semibold">Order not found</h1>
          <p className="text-gray-600 mt-2">
            The order with ID "{id}" could not be found.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-[1600px] p-10 space-y-8">
      <div className="flex items-center w-full gap-6">
        <BackButton />
        <h1 className="text-[2.4rem] font-semibold">Order Information</h1>
      </div>
      <SingleOrderContainer data={order} />
      {/* <pre className="text-[1.6rem]">{JSON.stringify(order, null, 2)}</pre> */}
    </section>
  );
}

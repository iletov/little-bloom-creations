import BackButton from '@/component/dashboard/back-button/BackButton';
import SingleOrderContainer from '@/component/dashboard/single-order/SingleOrderContainer';
import { Button } from '@/components/ui/button';
import {
  getSingleOrder,
} from '@/supabase/dashboard/getOrders';
import React from 'react';
import { Order } from '@/types';

// This page is fully dynamic since it accesses cookies() for auth

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
        <BackButton />
        <div className="text-center py-20">
          <h1 className="text-3xl font-semibold">Order not found</h1>
          <p className="text-slate-400 mt-2 text-[1.6rem]">
            The order with ID &quot;{id}&quot; could not be found.
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

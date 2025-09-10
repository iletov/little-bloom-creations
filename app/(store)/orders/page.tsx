import { CancelPayment } from '@/component/buttons/CancelPayment';
import { urlFor } from '@/sanity/lib/image';
import { getOrders } from '@/sanity/lib/orders/getOrders';
import { auth } from '@clerk/nextjs/server';
import { unstable_noStore } from 'next/cache';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import React from 'react';
import { Reference } from 'sanity';

export const dynamic = 'force-dynamic';
export default async function OrdersPage() {
  unstable_noStore();

  const { userId } = await auth();

  if (!userId) return redirect('/');

  const orders = await getOrders(userId!);

  const path = '/orders';

  const getOrderStatusStyle = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-[#d1fab4] px-6 text-[#5ea142]';
      case 'pending':
        return 'bg-slate-200 px-6 text-slate-600';
      case 'canceled':
        return 'bg-red-50 px-6 text-red-500';
      default:
        return '';
    }
  };

  return (
    <section className=" max-w-4xl mt-10 mx-auto ">
      <header>
        <h1 className="bg-white shadow-xl  p-8 text-3xl">My Orders</h1>
      </header>
      {orders?.map((order: any) => (
        <div
          key={order._id}
          className="my-8 space-y-4 border-[1px] bg-white shadow-xl p-8">
          <div>
            <div className="text-slate-600">
              <p>Order Number:</p>
              <span className="text-lime-500">{order?.orderNumber}</span>
            </div>

            <div className="text-slate-600">
              <p>Order Date: </p>
              {order?.orderDate
                ? new Date(order?.orderDate).toLocaleDateString()
                : 'N/A'}
            </div>
            <p className="text-slate-600">
              Order Status:{' '}
              <span className={getOrderStatusStyle(order?.status)}>
                {order?.status}
              </span>
            </p>
            <div className="text-slate-600">
              <p>Total Amount:</p>
              <p className="font-bold text-lg">{order?.totalPrice} лв.</p>
            </div>
          </div>
          {order?.amountDiscount && (
            <div className="bg-red-50/50 py-2 px-4">
              <p className="text-red-700">
                Discound: {order?.amountDiscount || 0} лв.
              </p>
              <p>
                Original Amount:{' '}
                {(order?.totalPrice + order?.amountDiscount).toFixed(2)}
                лв.
              </p>
            </div>
          )}

          <div>
            {order?.products.map((product: any) => (
              <div
                key={product?.product._id}
                className="my-4 flex gap-4 place-items-center border-[1px]">
                <div className="">
                  <Image
                    alt={product?.product?.Name || ''}
                    src={urlFor(product?.product?.images[0] as Reference).url()}
                    width={100}
                    height={100}
                  />
                </div>
                <div className="w-full mx-4">
                  <p>{product?.product.Name}</p>
                  <p>quantity: {product?.quantity}</p>
                  <p className="text-right">
                    price: {product?.product?.price} лв.
                  </p>
                </div>
              </div>
            ))}
          </div>
          {order?.status === 'pending' && (
            <CancelPayment
              // paymentIntentId={order?.stripePaymentIntentId}
              path={path}
            />
          )}
        </div>
      ))}
    </section>
  );
}

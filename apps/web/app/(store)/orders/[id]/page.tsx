import { getSingleOrder } from '@/supabase/dashboard/getOrders';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { bg } from 'date-fns/locale';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { getAllProductsSanity } from '@/sanity/lib/fetch/fetchData';
import { urlFor } from '@/sanity/lib/image';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  CreditCard,
  ChevronLeft,
  ShoppingBag,
  ArrowRight,
} from 'lucide-react';
import { getOrderStatusConfig } from '@/config/order-status';

export const revalidate = 60;

const TRACKING_STEPS = [
  { key: 'pending', label: 'Получена', icon: ShoppingBag },
  { key: 'confirmed', label: 'Потвърдена', icon: getOrderStatusConfig('confirmed').icon },
  { key: 'shipped', label: 'Изпратена', icon: getOrderStatusConfig('shipped').icon },
  { key: 'delivered', label: 'Доставена', icon: getOrderStatusConfig('delivered').icon },
];

function formatPrice(value: number) {
  return `${value.toFixed(2)} €`;
}

export default async function CustomerOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getSingleOrder(id);

  if (!order) notFound();

  const statusKey = order.status?.toLowerCase() ?? 'pending';
  const statusConfig = getOrderStatusConfig(statusKey);
  const StatusIcon = statusConfig.icon;
  const currentStep = statusConfig.step ?? 1;
  const isCancelled = statusKey === 'cancelled';

  const grandTotal = Number(order.total_amount ?? 0);
  const deliveryCost = Number(order.delivery_cost ?? 0);
  const totalAmount = grandTotal - deliveryCost;

  const sanityProducts = await getAllProductsSanity();

  return (
    <div className="min-h-screen font-montserrat bg-green-0">
      {/* Hero Header */}
      <div className="pt-32 pb-12 px-6 bg-gradient-to-br from-green-1 to-green-0">
        <div className="max-w-[120rem] mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[1.3rem] mb-6 transition-all duration-200 hover:gap-2.5 text-green-9"
          >
            <ChevronLeft className="w-4 h-4" />
            Обратно към магазина
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-[1.3rem] uppercase tracking-widest mb-1 text-green-5">
                Проследяване на поръчка
              </p>
              <h1 className="text-[2.4rem] sm:text-[3rem] font-bold text-green-dark">
                #{order.order_number}
              </h1>
              <p className="text-[1.3rem] mt-1 text-green-9">
                Направена на{' '}
                {format(new Date(order.created_at), "d MMMM yyyy 'в' HH:mm", {
                  locale: bg,
                })}
              </p>
            </div>

            {/* Status Badge */}
            <div
              className={cn(
                "inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[1.4rem] font-semibold border",
                statusConfig.badgeClasses
              )}
            >
              <StatusIcon className="w-5 h-5" />
              {statusConfig.label}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[120rem] mx-auto px-6 pb-24 mt-8">
        {/* Progress Tracker */}
        {!isCancelled && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-8">
            <div className="relative flex items-center justify-between">
              {/* Progress Line */}
              <div className="absolute left-5 right-5 sm:left-[2.5rem] sm:right-[2.5rem] top-5 h-0.5 bg-gray-100">
                <div
                  className={cn(
                    "absolute left-0 top-0 h-full bg-green-5 transition-all duration-700",
                    {
                      1: 'w-0',
                      2: 'w-1/3',
                      3: 'w-2/3',
                      4: 'w-full',
                    }[currentStep] || 'w-0'
                  )}
                />
              </div>

              {TRACKING_STEPS.map((step, idx) => {
                const stepNum = idx + 1;
                const isCompleted = currentStep >= stepNum;
                const isActive = currentStep === stepNum;
                const StepIcon = step.icon;

                return (
                  <div key={step.key} className="relative flex flex-col items-center gap-2 z-10">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                        isCompleted
                          ? "text-white border-transparent bg-green-9"
                          : "bg-white border-gray-200 text-gray-300"
                      )}
                    >
                      <StepIcon className="w-4 h-4" />
                    </div>
                    <span
                      className={cn(
                        "text-[1.1rem] sm:text-[1.2rem] font-medium text-center hidden sm:block",
                        isCompleted ? "text-gray-700" : "text-gray-300",
                        isActive && "font-bold"
                      )}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Status message */}
            <div
              className={cn(
                "mt-6 p-4 rounded-xl text-[1.3rem] flex items-start gap-3 border",
                statusConfig.badgeClasses
              )}
            >
              <StatusIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">{statusConfig.label}</p>
                <p className="text-gray-600 mt-0.5">{statusConfig.description}</p>
                {order.shipment_number && (
                  <p className="mt-1.5 font-mono font-medium text-gray-700">
                    Товарителница:{' '}
                    <span className="text-green-9">{order.shipment_number}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Products */}
          <div className="lg:col-span-2 space-y-5">
            <h2 className="text-[1.8rem] font-bold text-green-dark">
              Продукти
            </h2>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {order.order_items?.map((item: any, idx: number) => {
                const price = Number(item.unit_price ?? item.subtotal ?? 0);
                const total = price * (item.quantity ?? 1);

                // Find matching product in Sanity
                let imageUrl = item.image_url;
                if (!imageUrl) {
                  const sanityProduct = sanityProducts.find(
                    (p: any) => p.sku === item.product_sku || p.variants?.some((v: any) => v.sku === item.product_sku)
                  );
                  if (sanityProduct) {
                    const variant = sanityProduct.variants?.find((v: any) => v.sku === item.product_sku);
                    const imageRef = variant?.images?.[0] || sanityProduct.images?.[0];
                    if (imageRef) {
                      imageUrl = urlFor(imageRef).url();
                    }
                  }
                }

                return (
                  <div
                    key={item.id ?? idx}
                    className="flex items-center gap-5 px-6 py-5 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                  >
                    {/* Image */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center bg-green-1">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={item.name ?? 'Продукт'}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="w-8 h-8 text-green-5" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[1.5rem] font-semibold text-gray-900 truncate">
                        {item.name}
                      </p>
                      {item.variant_name && (
                        <p className="text-[1.2rem] text-gray-400 mt-0.5">{item.variant_name}</p>
                      )}
                      <p className="text-[1.3rem] text-gray-500 mt-1">
                        {formatPrice(price)} × {item.quantity}
                      </p>
                    </div>

                    {/* Price */}
                    <p className="text-[1.6rem] font-bold flex-shrink-0 text-green-dark">
                      {formatPrice(total)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Summary + Shipping */}
          <div className="space-y-5">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-50">
                <h2 className="text-[1.6rem] font-bold text-green-dark">
                  Обобщение
                </h2>
              </div>

              <div className="px-6 py-5 space-y-3">
                <div className="flex justify-between items-center text-[1.4rem] text-gray-600">
                  <span>Продукти</span>
                  <span>{formatPrice(totalAmount)}</span>
                </div>
                <div className="flex justify-between items-center text-[1.4rem] text-gray-600">
                  <span>
                    Доставка
                    <span className="block text-[1.1rem] text-gray-400">
                      {order.delivery_method === 'office' ? 'Еконт Офис' : 'Еконт Адрес'}
                    </span>
                  </span>
                  <span>{deliveryCost > 0 ? formatPrice(deliveryCost) : '—'}</span>
                </div>
              </div>

              <div className="mx-4 mb-4 rounded-xl px-5 py-4 bg-green-1">
                <div className="flex justify-between items-center">
                  <span className="text-[1.4rem] font-semibold text-green-dark">
                    Общо
                  </span>
                  <span className="text-[2rem] font-bold text-green-dark">
                    {formatPrice(grandTotal)}
                  </span>
                </div>
              </div>

              {/* Payment method */}
              <div className="px-6 pb-5">
                <div className="flex items-center gap-2.5 text-[1.3rem] text-gray-500">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-green-1">
                    <CreditCard className="w-4 h-4 text-green-9" />
                  </div>
                  {order.payment_method === 'card' ? 'Платено с карта' : 'Наложен платеж'}
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            {order.order_shipping && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-50 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-green-5" />
                  <h2 className="text-[1.6rem] font-bold text-green-dark">
                    Данни за доставка
                  </h2>
                </div>

                <div className="px-6 py-5 space-y-4 text-[1.3rem]">
                  <div>
                    <p className="text-[1.1rem] uppercase tracking-wider text-gray-400 mb-1">Получател</p>
                    <p className="font-semibold text-gray-800">{order.order_shipping.full_name}</p>
                    <p className="text-gray-500">{order.order_shipping.phone}</p>
                    {order.order_shipping.email && (
                      <p className="text-gray-500">{order.order_shipping.email}</p>
                    )}
                  </div>

                  <div className="h-px bg-gray-50" />

                  <div>
                    <p className="text-[1.1rem] uppercase tracking-wider text-gray-400 mb-1">Адрес</p>
                    <p className="text-gray-800">
                      {order.order_shipping.city}
                      {order.order_shipping.street ? `, ${order.order_shipping.street}` : ''}
                      {order.order_shipping.street_number ? ` №${order.order_shipping.street_number}` : ''}
                    </p>
                    {order.order_shipping.quarter && (
                      <p className="text-gray-500">кв. {order.order_shipping.quarter}</p>
                    )}
                    {order.order_shipping.postal_code && (
                      <p className="text-gray-400">{order.order_shipping.postal_code}</p>
                    )}
                  </div>

                  {order.order_shipping.office_code && (
                    <>
                      <div className="h-px bg-gray-50" />
                      <div>
                        <p className="text-[1.1rem] uppercase tracking-wider text-gray-400 mb-1">Офис</p>
                        <p className="text-gray-800">
                          {order.order_shipping.additional_info
                            ? `${order.order_shipping.additional_info} (${order.order_shipping.office_code})`
                            : order.order_shipping.office_code}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* CTA */}
            <Link
              href="/"
              className="flex items-center justify-center gap-2 w-full py-4 rounded-xl text-[1.4rem] font-semibold text-white transition-all duration-200 hover:opacity-90 hover:gap-3 bg-green-9"
            >
              Продължи пазаруването
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

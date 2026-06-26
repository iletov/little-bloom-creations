import { getUserOrders } from '@/supabase/dashboard/getUserOrders';
import { createClient } from '@/lib/supabaseServer';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { bg } from 'date-fns/locale';
import { ShoppingBag, ArrowRight, Package, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Order } from '@/types';
import { getOrderStatusConfig } from '@/config/order-status';

export const revalidate = 0; // Dynamic page

function formatPrice(value: number | string) {
  return `${Number(value).toFixed(2)} €`;
}

export default async function UserOrdersPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/');
  }

  const orders: Order[] = await getUserOrders();

  return (
    <div className="min-h-screen bg-gray-50/50 pt-24 pb-20 md:pt-32 font-montserrat">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[2.4rem] md:text-[3rem] font-bold text-gray-900 mb-2">
            Моите поръчки
          </h1>
          <p className="text-[1.4rem] text-gray-500">
            История на всички ваши направени поръчки
          </p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-green-1 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="w-10 h-10 text-green-9" />
            </div>
            <h2 className="text-[1.8rem] font-bold text-gray-900 mb-2">
              Нямате направени поръчки
            </h2>
            <p className="text-[1.4rem] text-gray-500 mb-8 max-w-[400px]">
              Все още не сте направили нито една поръчка. Разгледайте нашите продукти и направете първата си покупка!
            </p>
            <Link 
              href="/categories"
              className="inline-flex items-center gap-2 bg-green-9 text-white px-8 py-4 rounded-xl text-[1.4rem] font-medium hover:bg-green-dark transition-colors"
            >
              Към магазина
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const statusConfig = getOrderStatusConfig(order.status);
              const StatusIcon = statusConfig.icon;
              
              return (
                <Link 
                  key={order.id} 
                  href={`/orders/${order.order_number || order.id}`}
                  className="block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group relative"
                >
                  {/* Order Header */}
                  <div className="px-6 py-5 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-[1.6rem] font-bold text-gray-900">
                          Поръчка #{order.order_number}
                        </h3>
                        <div className={cn(
                          "flex items-center gap-1.5 px-3 py-1 rounded-full text-[1.1rem] font-medium",
                          statusConfig.badgeClasses
                        )}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {statusConfig.label}
                        </div>
                      </div>
                      <p className="text-[1.3rem] text-gray-500">
                        {format(new Date(order.created_at || new Date()), 'd MMMM yyyy, HH:mm', { locale: bg })}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between sm:flex-col sm:items-end sm:justify-center gap-1">
                      <span className="text-[1.3rem] text-gray-500 sm:hidden">Общо:</span>
                      <span className="text-[1.8rem] font-bold text-green-dark">
                        {formatPrice(order.total_amount || 0)}
                      </span>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="px-6 py-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                        <Package className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[1.4rem] font-medium text-gray-900">
                          {order.order_items?.length || 0} {(order.order_items?.length || 0) === 1 ? 'продукт' : 'продукта'}
                        </p>
                        <p className="text-[1.3rem] text-gray-500 line-clamp-1">
                          {order.order_items?.map(item => item.name).join(', ')}
                        </p>
                      </div>
                    </div>

                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-green-1 transition-colors flex-shrink-0">
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-green-9 transition-colors" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

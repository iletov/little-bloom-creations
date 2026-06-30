// app/success/page.tsx
'use client';

import { Suspense, useEffect } from 'react';
import { apiConfig } from '@/lib/api/api-config';
import { useCart } from '@/hooks/useCart';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Loader2, XCircle, RefreshCcw, ShoppingBag, ReceiptText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

async function checkWebhookStatus(orderNumber: string) {
  const response = await fetch(
    `${apiConfig.baseUrl}/orders/status/${orderNumber}`,
  );

  if (!response.ok) {
    throw new Error('Failed to fetch webhook status');
  }

  return response.json();
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order_number');

  const { dispatchPaymentIntentId, clearCart } = useCart();

  const { data, error, isLoading } = useQuery({
    queryKey: ['webhook', orderNumber],
    queryFn: () => checkWebhookStatus(orderNumber!),
    enabled: !!orderNumber,
    refetchInterval: query => {
      const status = query.state.data?.status;
      if (
        status === 'success' ||
        status === 'refunded' ||
        status === 'failed'
      ) {
        return false; // stop polling
      }
      return 2000;
    },
    refetchIntervalInBackground: false,
    retry: 3,
    staleTime: 0,
  });

  const status = data?.status;
  const order = data?.order;
  const errorMessage = data?.error || data?.message || error?.message || '';

  useEffect(() => {
    dispatchPaymentIntentId(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (status === 'success') {
      clearCart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center text-center p-6">
        <div className="animate-spin h-16 w-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Checking order status...</p>
      </div>
    );
  }

  // Success state
  if (status === 'success') {
    return (
      <div className="max-w-4xl pt-40 pb-20 mx-auto px-6 text-center font-montserrat">
        <div className="bg-white border border-green-100 shadow-xl shadow-green-100/50 rounded-3xl p-10 md:p-16 flex flex-col items-center">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-8">
            <CheckCircle2 className="w-14 h-14 text-green-500" />
          </div>
          
          <h1 className="text-[3.2rem] font-semibold text-slate-800 mb-4 tracking-tight">
            {order?.payment_method === 'cash' ? 'Поръчката е приета успешно!' : 'Поръчката е направена успешно!'}
          </h1>
          <p className="text-[1.6rem] text-slate-500 mb-12">
            Благодарим ви за поръчката. Изпратихме потвърждение на вашия имейл адрес. 
            {order?.payment_method === 'cash' && ' Плащането ще се извърши с наложен платеж при доставка.'}
          </p>

          <div className="bg-slate-50/50 border border-slate-100 p-8 rounded-2xl w-full max-w-2xl text-left mb-12">
            <h2 className="text-[2rem] font-semibold text-slate-800 mb-6 flex items-center gap-3">
              <ReceiptText className="w-6 h-6 text-slate-400" />
              Детайли за поръчката
            </h2>

            <div className="space-y-4 text-[1.5rem]">
              <div className="flex justify-between items-center pb-4 border-b border-slate-200/60">
                <span className="text-slate-500">Номер на поръчка:</span>
                <span className="font-medium text-slate-800">{order?.order_number}</span>
              </div>

              <div className="flex justify-between items-center pb-4 border-b border-slate-200/60">
                <span className="text-slate-500">
                  {order?.payment_method === 'cash' ? 'Дължима сума:' : 'Платена сума:'}
                </span>
                <span className="font-semibold text-green-600 text-[1.8rem]">
                  {new Intl.NumberFormat('bg-BG', {
                    style: 'currency',
                    currency: 'EUR',
                  }).format(Number(order?.total_amount) || 0)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500">Дата:</span>
                <span className="font-medium text-slate-800">
                  {new Intl.DateTimeFormat('bg-BG', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  }).format(new Date(order?.created_at || new Date()))}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center w-full max-w-2xl">
            <Button asChild size="lg" className="w-full sm:w-auto text-[1.5rem] py-8 px-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-white">
              <Link href="/">
                <ShoppingBag className="w-5 h-5 mr-3" />
                Продължи с пазаруването
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto text-[1.5rem] py-8 px-10 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50">
              <Link href={`/orders/${order?.id}`}>
                Виж поръчката
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Pending state
  if (status === 'pending') {
    return (
      <div className="max-w-3xl pt-40 pb-20 mx-auto px-6 text-center font-montserrat">
        <div className="bg-white border border-slate-100 shadow-xl shadow-slate-100/50 rounded-3xl p-10 md:p-16 flex flex-col items-center">
          <Loader2 className="w-16 h-16 text-slate-400 animate-spin mb-8" />
          
          <h1 className="text-[2.8rem] font-semibold text-slate-800 mb-4 tracking-tight">
            Обработваме вашата поръчка
          </h1>
          <p className="text-[1.6rem] text-slate-500">
            Моля изчакайте, докато завършим процеса. Това отнема само няколко секунди...
          </p>
        </div>
      </div>
    );
  }

  // Error state - Insufficient Stock
  if (status === 'error' || status === 'failed') {
    return (
      <div className="max-w-3xl pt-40 pb-20 mx-auto px-6 text-center font-montserrat">
        <div className="bg-white border border-red-100 shadow-xl shadow-red-100/50 rounded-3xl p-10 md:p-16 flex flex-col items-center">
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-8">
            <XCircle className="w-14 h-14 text-red-500" />
          </div>
          
          <h1 className="text-[3.2rem] font-semibold text-slate-800 mb-4 tracking-tight">
            Възникна грешка с поръчката
          </h1>

          <div className="bg-red-50/50 border border-red-100 p-8 rounded-2xl w-full text-left mb-10">
            <h2 className="text-[1.8rem] font-semibold text-red-700 mb-3">
              {errorMessage}
            </h2>
            <p className="text-[1.5rem] text-red-600/80">
              {errorMessage.includes('Insufficient stock')
                ? 'За съжаление нямаме достатъчно наличност за този артикул. Вашето плащане е възстановено.'
                : 'Възникна проблем при обработката на вашата поръчка. Вашето плащане е възстановено.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center w-full">
            <Button asChild size="lg" className="w-full sm:w-auto text-[1.5rem] py-8 px-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-white">
              <Link href="/checkout">
                Опитай отново
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto text-[1.5rem] py-8 px-10 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50">
              <Link href="/">
                Към началната страница
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Refunded state
  if (status === 'refunded') {
    return (
      <div className="max-w-3xl pt-40 pb-20 mx-auto px-6 text-center font-montserrat">
        <div className="bg-white border border-yellow-100 shadow-xl shadow-yellow-100/50 rounded-3xl p-10 md:p-16 flex flex-col items-center">
          <div className="w-24 h-24 bg-yellow-50 rounded-full flex items-center justify-center mb-8">
            <RefreshCcw className="w-14 h-14 text-yellow-500" />
          </div>
          
          <h1 className="text-[3.2rem] font-semibold text-slate-800 mb-4 tracking-tight">
            Плащането е възстановено
          </h1>

          <div className="bg-yellow-50/50 border border-yellow-100 p-8 rounded-2xl w-full text-left mb-10">
            <p className="text-[1.6rem] text-slate-700 mb-4">
              Вашето плащане беше успешно възстановено по картата ви.
            </p>
            <p className="text-[1.5rem] text-red-600 font-medium mb-6">
              Причина: {errorMessage}
            </p>
            <p className="text-[1.4rem] text-slate-500">
              Възстановяването може да отнеме от 3 до 5 работни дни, за да се отрази в сметката ви.
            </p>
          </div>

          <Button asChild size="lg" className="text-[1.5rem] py-8 px-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-white">
            <Link href="/">
              Към началната страница
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Error state
  return (
    <div className="max-w-3xl pt-40 pb-20 mx-auto px-6 text-center font-montserrat">
      <div className="bg-white border border-red-100 shadow-xl shadow-red-100/50 rounded-3xl p-10 md:p-16 flex flex-col items-center">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-8">
          <XCircle className="w-14 h-14 text-red-500" />
        </div>
        
        <h1 className="text-[3.2rem] font-semibold text-slate-800 mb-4 tracking-tight">Възникна грешка</h1>
        <p className="text-[1.6rem] text-slate-500 mb-10">
          {errorMessage || 'Нещо се обърка.'}
        </p>

        <Button asChild size="lg" className="text-[1.5rem] py-8 px-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-white">
          <Link href="/">
            Към началната страница
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 flex items-center justify-center text-center p-6">
          <div className="animate-spin h-16 w-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      }>
      <SuccessContent />
    </Suspense>
  );
}

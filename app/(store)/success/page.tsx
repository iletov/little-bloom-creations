'use client';
import { Loader } from '@/component/loader/Loader';
import { useCart } from '@/hooks/useCart';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect } from 'react';

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order_number');
  // const sessionId = searchParams.get('session_id');
  const {
    clearCart,
    clearClientSecret,
    clearFormData,
    dispatchPaymentIntentId,
  } = useCart();

  useEffect(() => {
    if (orderNumber) {
      clearCart();
      clearFormData();
      clearClientSecret();
      dispatchPaymentIntentId(null);
    }
  }, [orderNumber, clearCart, clearFormData, clearClientSecret]);

  return (
    <section className="w-full product-bg_gradient  h-[calc(100vh-65px)] shadow-xl flex flex-col gap-4 items-center justify-center bg-foreground order">
      <header className="font-montserrat flex flex-col items-center justify-center gap-4 order-2">
        <h1 className="text-2xl ">Успешно завършена поръчка!</h1>
        <p className="grid text-center">
          Номер на поръчка: <span>{orderNumber}</span>
        </p>
        <p>Скоро ще се свържем с вас</p>
        {/* {sessionId && <p className="text-slate-800">Session ID: {sessionId}</p>} */}
      </header>
      <div className="max-w-[120px] md:max-w-[160px] md:max-h-[160px]">
        <Image
          src={'/ok.png'}
          alt="cart-empty"
          width={400}
          height={400}
          className="w-full h-full object-cover"
        />
      </div>
    </section>
  );
}

const SuccessPage = () => {
  return (
    <Suspense
      fallback={
        <div className="h-[calc(100vh-65px)] flex items-center justify-center">
          <Loader />
        </div>
      }>
      <SuccessPageContent />
    </Suspense>
  );
};

export default SuccessPage;

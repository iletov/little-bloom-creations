// app/success/page.tsx
'use client';

import { useCart } from '@/hooks/useCart';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

async function checkWebhookStatus(orderNumber: string) {
  const response = await fetch(
    `/api/webhook-status?order_number=${orderNumber}`,
  );

  if (!response.ok) {
    throw new Error('Failed to fetch webhook status');
  }

  return response.json();
}


export default function SuccessPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order_number');

  const { dispatchPaymentIntentId } = useCart();

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
  const errorMessage = data?.error || error?.message;

  dispatchPaymentIntentId(null);

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
      <div className="max-w-6xl pt-40 mx-auto p-6 text-center">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8">
          <h1 className="text-[3.6rem] font-bold text-green-600 mb-4">
            ✓ Payment Successful!
          </h1>

          <div className="bg-white p-6 rounded mt-6 text-left">
            <h2 className="text-[2rem] font-semibold mb-4">Order Details</h2>

            <div className="space-y-3 text-[1.6rem]">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Number:</span>
                <span className="font-mono font-semibold">
                  {order?.order_number}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-semibold">{order?.total_amount} EUR</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span>{new Date(order?.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <p className="mt-6 text-gray-600">
            A confirmation email has been sent to your email address.
          </p>

          <div className="mt-8 space-x-4">
            <button
              onClick={() => (window.location.href = '/')}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
              Continue Shopping
            </button>

            <button
              onClick={() => (window.location.href = `/orders/${order?.id}`)}
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300">
              View Order
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Pending state
  if (status === 'pending') {
    return (
      <div className="max-w-6xl pt-40 mx-auto p-6 text-center">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>

          <h1 className="text-2xl font-bold text-blue-600 mb-4">
            Processing Your Order
          </h1>

          <p className="text-gray-600">
            We're creating your order and reducing stock. This usually takes a
            few seconds...
          </p>
        </div>
      </div>
    );
  }

  // Error state - Insufficient Stock
  if (status === 'error' || status === 'failed') {
    return (
      <div className="max-w-6xl pt-40 mx-auto p-6 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            ✗ Order Failed
          </h1>

          <div className="bg-white p-6 rounded mt-6">
            <h2 className="text-lg font-semibold text-red-600 mb-2">
              {errorMessage}
            </h2>

            <p className="text-gray-600">
              {errorMessage.includes('Insufficient stock')
                ? "Unfortunately, we don't have enough stock available for this item. Your payment has been refunded."
                : 'There was an issue processing your order. Your payment has been refunded.'}
            </p>
          </div>

          <div className="mt-8 space-x-4">
            <button
              onClick={() => (window.location.href = '/checkout')}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
              Return to Checkout
            </button>

            <button
              onClick={() => (window.location.href = '/')}
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Refunded state
  if (status === 'refunded') {
    return (
      <div className="max-w-6xl pt-40 mx-auto p-6 text-center">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-yellow-600 mb-4">
            ⟲ Payment Refunded
          </h1>

          <div className="bg-white p-6 rounded mt-6">
            <p className="text-gray-600 mb-4">
              Your payment has been refunded to your card.
            </p>

            <p className="text-red-600 font-semibold">Reason: {errorMessage}</p>

            <p className="text-sm text-gray-500 mt-4">
              The refund may take 3-5 business days to appear in your account.
            </p>
          </div>

          <div className="mt-8">
            <button
              onClick={() => (window.location.href = '/')}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  return (
    <div className="max-w-6xl pt-40 mx-auto p-6 text-center">
      <div className="bg-red-50 border border-red-200 rounded-lg p-8">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-gray-600">
          {errorMessage || 'Something went wrong'}
        </p>

        <button
          onClick={() => (window.location.href = '/')}
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Go Home
        </button>
      </div>
    </div>
  );
}

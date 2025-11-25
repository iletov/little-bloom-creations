// app/success/page.tsx
'use client';

import { useCart } from '@/hooks/useCart';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order_number');

  const [status, setStatus] = useState('loading');
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState('');
  const [isPolling, setIsPolling] = useState(true);

  const { dispatchPaymentIntentId } = useCart();

  useEffect(() => {
    const checkWebhookStatus = async () => {
      try {
        const response = await fetch(
          `/api/webhook-status?order_number=${orderNumber}`,
        );
        const data = await response.json();

        console.log('Webhook status:', data);

        if (data.status === 'success') {
          setOrder(data.order);
          setStatus('success');
          setIsPolling(false);
        } else if (data.status === 'failed') {
          setError(data.error || 'Order creation failed');
          setStatus('error');
          setIsPolling(false);
        } else if (data.status === 'refunded') {
          setError(data.error || 'Payment was refunded');
          setStatus('refunded');
          setIsPolling(false);
        } else if (data.status === 'pending') {
          // Still processing, keep polling
          setStatus('pending');
        }
      } catch (err: any) {
        console.error('Error checking status:', err);
        setError(err.message);
      }
    };

    // Initial check
    checkWebhookStatus();

    // Poll every 2 seconds for up to 10 seconds
    const interval = setInterval(checkWebhookStatus, 2000);
    const timeout = setTimeout(() => {
      setIsPolling(false);
      clearInterval(interval);
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [orderNumber]);

  dispatchPaymentIntentId(null);

  // Success state
  if (status === 'success') {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8">
          <h1 className="text-4xl font-bold text-green-600 mb-4">
            ✓ Payment Successful!
          </h1>

          <div className="bg-white p-6 rounded mt-6 text-left">
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-mono font-semibold">{order?.id}</span>
              </div>
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
      <div className="max-w-2xl mx-auto p-6 text-center">
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
  if (status === 'error') {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            ✗ Order Failed
          </h1>

          <div className="bg-white p-6 rounded mt-6">
            <h2 className="text-lg font-semibold text-red-600 mb-2">{error}</h2>

            <p className="text-gray-600">
              {error.includes('Insufficient stock')
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
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-yellow-600 mb-4">
            ⟲ Payment Refunded
          </h1>

          <div className="bg-white p-6 rounded mt-6">
            <p className="text-gray-600 mb-4">
              Your payment has been refunded to your card.
            </p>

            <p className="text-red-600 font-semibold">Reason: {error}</p>

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
    <div className="max-w-2xl mx-auto p-6 text-center">
      <div className="bg-red-50 border border-red-200 rounded-lg p-8">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-gray-600">{error || 'Something went wrong'}</p>

        <button
          onClick={() => (window.location.href = '/')}
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Go Home
        </button>
      </div>
    </div>
  );
}

'use client';
import { validateAddress } from '@/actions/ekont/validateAddress';
import { Metadata } from '@/app/api/payment-intent/route';
import { Loader } from '@/component/loader/Loader';
import { AlertBox } from '@/component/modals/AlertBox';
import { Separator } from '@/component/separator/Separator';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useCities } from '@/hooks/useCities';
import { useSenderDetails } from '@/hooks/useSenderDetails';
import { fullAddress, guestSchema } from '@/lib/form-validation/validations';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export const OrderSummery = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ title: '', message: '' });

  const { user } = useAuth();

  const { isLoading } = useCities();
  const { ekontMethod } = useSenderDetails();
  const {
    deliveryCost,
    deliveryCostFlag,
    totalItems,
    totalPrice,
    addressFormData,
    guestFormData,
    setMetadata,
  } = useCart();

  // console.log('ORDER SUMMERY - USER', user, metadata);
  const router = useRouter();

  const handleCheckOut = async () => {
    try {
      const metadata: Metadata = {
        orderNumber: crypto.randomUUID(),
        customerName:
          user?.user_metadata?.name ??
          guestFormData?.firstName + ' ' + guestFormData?.lastName,
        customerEmail: user?.email ?? guestFormData?.email,

        supabaseUserId: user?.id ?? null,
      };
      setMetadata(metadata);

      if (!user) {
        const isGuseValid = guestSchema.safeParse(guestFormData);
        if (!isGuseValid.success) {
          setShowAlert(true);
          setAlertMessage({
            title: 'Error Guest',
            message: isGuseValid.error.issues[0]?.message,
          });
          return;
        }
      }

      const isAddressValid = fullAddress.safeParse(addressFormData);
      if (!isAddressValid.success) {
        setShowAlert(true);
        setAlertMessage({
          title: 'Error Address',
          message: isAddressValid.error.issues[0]?.message,
        });
        console.log(isAddressValid);

        return;
      }

      if (ekontMethod === 'ekont-courier') {
        const isAddressValid = await validateAddress(addressFormData);

        console.log('VALIDATION', isAddressValid?.validationStatus);

        if (!isAddressValid?.validationStatus) {
          console.log('isAddressValid', isAddressValid);
          setShowAlert(true);
          setAlertMessage({
            title: 'Error',
            message: isAddressValid?.innerErrors[0].message,
          });
        }

        const continueToCheckout =
          isAddressValid?.validationStatus === 'normal' ||
          isAddressValid?.validationStatus === 'processed ';

        if (continueToCheckout) {
          router.push('/checkout');
        }
      } else if (ekontMethod === 'ekont-office') {
        router.push('/checkout');
      }
    } catch (error) {
      console.error('Error submitting checkout form', error);
    }
    // setLoading(false);
  };

  return (
    <>
      <div
        className="
      z-50 w-full max-w-full mx-auto h-fit md:border-[1px] font-montserrat rounded-lg shadow-md bg-white space-y-1.5 md:space-y-3 px-6 py-4 order-first fixed bottom-0 left-0 lg:left-auto lg:sticky lg:top-[10rem] lg:order-last ">
        <h3 className="md:font-semibold">Информация за поръчката:</h3>
        <p className="flex justify-between text-[1.6rem]">
          Артикули:
          <span className="flex gap-1">
            <X size={10} className="self-center" /> {totalItems}
          </span>
        </p>
        <Separator />
        <p className="flex justify-between text-[1.6rem]">
          <span className="">Цена за доставка:</span>
          <span>{deliveryCost} лв.</span>
        </p>
        <p className="flex justify-between mb-2 md:mb-6">
          <span className="font-semibold text-[1.6rem]">Обща сума:</span>
          <span className="font-semibold text-[1.6rem]">
            {(totalPrice + deliveryCost).toFixed(2)} лв.
          </span>
        </p>

        <Button
          disabled={deliveryCost === 0 || deliveryCostFlag}
          onClick={handleCheckOut}
          variant="default"
          className="w-full">
          {isLoading || deliveryCostFlag ? <Loader /> : 'Next'}
        </Button>
      </div>
      {showAlert && (
        <AlertBox
          title={alertMessage.title}
          description={alertMessage.message}
          reset={() => setShowAlert(false)}
        />
      )}
    </>
  );
};

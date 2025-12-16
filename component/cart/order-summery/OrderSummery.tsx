'use client';
import { validateAddress } from '@/actions/ekont/validateAddress';
import { validateAddressSpeedy } from '@/actions/speedy/validateAddressSpeedy';
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
import { createParcelsFromItems } from '@/lib/utils/createParcelsFromItems';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export const OrderSummery = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ title: '', message: '' });

  const { user } = useAuth();

  const { isLoading } = useCities(false);
  const { deliveryMethod, validationStreet, selectedOffice, selectedCity } =
    useSenderDetails();
  const {
    items,
    deliveryCost,
    totalItems,
    totalPrice,
    addressFormData,
    guestFormData,
    setMetadata,
  } = useCart();

  const router = useRouter();

  const handleCheckOut = async () => {
    try {
      const metadata: Metadata = {
        orderNumber: crypto.randomUUID(),
        customerName: user
          ? `${guestFormData?.firstName} ${guestFormData?.lastName} (${user?.user_metadata?.name})`
          : `${guestFormData?.firstName} ${guestFormData?.lastName}`,
        customerEmail: user?.email ?? guestFormData?.email,

        supabaseUserId: user?.id ?? null,
      };
      setMetadata(metadata);

      if (!user) {
        const isGuestValid = guestSchema.safeParse(guestFormData);
        if (!isGuestValid.success) {
          setShowAlert(true);
          setAlertMessage({
            title: 'Error Guest',
            message: isGuestValid.error.issues[0]?.message,
          });
          return;
        }
      }

      const isAddressFormValid = fullAddress.safeParse(addressFormData);
      if (!isAddressFormValid.success) {
        setShowAlert(true);
        setAlertMessage({
          title: 'Error Address',
          message: isAddressFormValid.error.issues[0]?.message,
        });
        console.log(isAddressFormValid);
        return;
      }

      //EKONT DELIVERY
      if (deliveryMethod === 'ekont-delivery') {
        const isAddressValid = await validateAddress(
          addressFormData,
          selectedCity?.postCode,
        );

        console.log(
          '#--Validating address...',
          isAddressValid?.validationStatus,
        );

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
          console.log(
            `# --Validating status 'Address' - ${isAddressValid.validationStatus}`,
          );
          console.log(
            `# --Sending 'Metadata' to checkout with method '${deliveryMethod}'`,
            metadata,
          );

          router.push('/checkout');
        }
      } else if (deliveryMethod === 'ekont-office') {
        //EKONT OFFICE

        const validatePostCode =
          selectedCity?.postCode === addressFormData?.postalCode;

        if (!validatePostCode) {
          setShowAlert(true);
          setAlertMessage({
            title: 'Error',
            message: `Пощенският код не съвпада с избрания град. Очакван код: ${selectedCity?.postCode}`,
          });
          return;
        }

        router.push('/checkout');
      } else if (deliveryMethod.startsWith('speedy')) {
        //SPEEDY DELIVERY and PICKUP

        console.log(
          `# ---Sending 'Metadata' to checkout with method '${deliveryMethod}'`,
          metadata,
        );

        const recipientData = {
          clientName: guestFormData?.firstName + ' ' + guestFormData?.lastName,
          email: user?.email ?? guestFormData?.email,
        };

        const parcels = createParcelsFromItems(items, metadata?.orderNumber);

        const validateAddress = await validateAddressSpeedy(
          recipientData,
          addressFormData,
          deliveryMethod,
          selectedOffice?.id,
          selectedCity?.id,
          validationStreet?.id,
          parcels,
        );

        const addressIsValid = validateAddress?.valid;

        if (addressIsValid) {
          console.log('# --Address is valid, Proceeding to checkout--');
          router.push('/checkout');
        } else {
          console.log(
            '# --Address is invalid, Error message: ',
            validateAddress?.error.message,
          );
          setShowAlert(true);
          setAlertMessage({
            title: 'Error',
            message: validateAddress?.error.message,
          });
        }
      }
    } catch (error) {
      console.error('Error submitting checkout form', error);
    }
    // setLoading(false);
  };

  const isButtonDisabled = (): boolean => {
    // No delivery method selected
    if (!deliveryMethod) return true;

    // Office/Pickup - need city + office
    if (
      deliveryMethod === 'ekont-office' ||
      deliveryMethod === 'speedy-pickup'
    ) {
      return !selectedCity?.id || !selectedOffice?.id;
    }

    // Delivery mode for speedy - need city + validated street
    if (deliveryMethod === 'speedy-delivery') {
      return !selectedCity?.id || !validationStreet?.id;
    }
    // Delivery mode for ekont - need city
    if (deliveryMethod === 'ekont-delivery') {
      return !selectedCity?.id;
    }

    return true;
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
          disabled={isButtonDisabled()}
          onClick={handleCheckOut}
          variant="default"
          className="w-full">
          {isLoading ? <Loader /> : 'Next'}
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

'use client';
import { useCart } from '@/hooks/useCart';
// ('next/image');
import React, { useEffect, useState } from 'react';
import { ItemsList } from '@/component/cart/items-list/ItemsList';
import { OrderDetailsContainer } from '@/component/cart/order-details-container/OrderDetailsContainer';
import { OrderSummery } from '@/component/cart/order-summery/OrderSummery';
import { useCities } from '@/hooks/useCities';
import { FormProvider, useForm } from 'react-hook-form';
import { notFound, redirect, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AddressFormDataType,
  fullAddress,
  fullAddressType,
  GuestFormDataType,
  guestSchema,
} from '@/lib/form-validation/validations';
import { useUser } from '@clerk/nextjs';
import { Metadata } from '@/app/api/payment-intent/route';
import { validateAddress } from '@/actions/ekont/validateAddress';
import { AlertBox } from '@/component/modals/AlertBox';
import Image from 'next/image';

redirect(notFound());

export default function CartPage() {
  const [deliveryMethod, setDeliveryMethod] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ title: '', message: '' });
  const { user } = useUser();
  const {
    saveAddressData,
    saveGuestData,
    totalPrice,
    groupedItems,
    setMetadata,
    deliveryCost,
  } = useCart();
  const { isLoading } = useCities();
  const router = useRouter();

  const totalItemsCount = groupedItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  //===========================

  const guestForm = useForm<GuestFormDataType>({
    resolver: zodResolver(guestSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
    },
  });

  const addressForm = useForm<fullAddressType>({
    resolver: zodResolver(fullAddress),
    defaultValues: {
      country: 'България',
      city: '',
      street: '',
      streetNumber: '',
      other: '',
      postalCode: '',
      phoneNumber: '',
      officeCode: '',
    },
  });

  const onAddressFormSubmit = (data: AddressFormDataType) => {
    saveAddressData(data);
  };

  const handleCheckOut = async () => {
    // setLoading(true);
    let guestFormValid = true;

    try {
      if (!user) {
        guestFormValid = await guestForm.trigger();
      }

      const metadata: Metadata = {
        orderNumber: crypto.randomUUID(),
        customerName:
          guestForm.getValues()?.firstName +
          ' ' +
          guestForm.getValues()?.lastName,
        customerEmail:
          user?.emailAddresses[0].emailAddress ?? guestForm.getValues()?.email,
        clerkUserId: user?.id ?? 'GUEST_' + crypto.randomUUID().slice(0, 8),
      };
      setMetadata(metadata);

      saveGuestData(guestForm.getValues());

      if (deliveryMethod === 'ekont-courier') {
        const deliveryFormValid = await addressForm.trigger();
        if (deliveryFormValid) {
          onAddressFormSubmit(addressForm.getValues());
        }

        const isAddressValid = await validateAddress(
          addressForm.getValues()?.city,
          addressForm.getValues()?.street,
          addressForm.getValues()?.streetNumber,
          addressForm.getValues()?.other,
          addressForm.getValues()?.postalCode,
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
          (user || guestFormValid) &&
          deliveryFormValid &&
          (isAddressValid?.validationStatus === 'normal' ||
            isAddressValid?.validationStatus === 'processed ');

        if (continueToCheckout) {
          router.push('/checkout');
        }
      } else if (deliveryMethod === 'ekont-office') {
        const deliveryFormValid = await addressForm.trigger();

        if ((user || guestFormValid) && deliveryFormValid) {
          router.push('/checkout');
        }
      }
    } catch (error) {
      console.error('Error submitting checkout form', error);
    }
    // setLoading(false);
  };

  //===========================

  // const ekontSender = await getEkontSenderDetails();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  if (groupedItems.length === 0)
    return (
      <div className="flex flex-col items-center space-y-4 justify-center h-screen">
        <div className="max-w-[150px] md:max-w-[250px] md:max-h-[250px]">
          <Image
            src={'/emptyCart.png'}
            alt="cart-empty"
            width={500}
            height={500}
            className="w-full h-full object-cover"
          />
        </div>
        <h1 className="md:text-[1.25rem] font-montserrat">
          Количката е празна...
        </h1>
      </div>
    );

  return (
    <section className="section_wrapper font-montserrat xl:px-32 space-y-5 md:flex gap-10 xl:gap-10 mb-[30rem] lg:mb-[24rem]">
      <div className="flex-[1.1] lg:mt-5 px-3">
        <div className="  bg-secondaryPurple/15 rounded-lg shadow-md">
          {groupedItems?.map(group => (
            <ItemsList key={group.product._id + group.size} group={group} />
          ))}
        </div>
        <div className="my-10"></div>

        <OrderDetailsContainer
          setDeliveryMethodAction={setDeliveryMethod}
          deliveryMethod={deliveryMethod}
          guestForm={guestForm}
          addressForm={addressForm}
          onAddressFormSubmitAction={onAddressFormSubmit}
        />
      </div>
      <div className=" flex-[0.75]">
        <OrderSummery
          totalItemsCount={totalItemsCount}
          totalPrice={totalPrice}
          handleCheckOut={handleCheckOut}
          deliveryCost={deliveryCost}
          loadingState={isLoading}
        />
      </div>
      {showAlert && (
        <AlertBox
          title={alertMessage.title}
          description={alertMessage.message}
          reset={() => setShowAlert(false)}
        />
      )}
    </section>
  );
}

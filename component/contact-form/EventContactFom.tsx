'use client';
import {
  ContactFormDataType,
  contactSchema,
} from '@/lib/form-validation/validations';
import { useUser } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AlertBox } from '../modals/AlertBox';
import BasicForm from './BasicForm';
import { toast } from 'sonner';
import { createEventForm } from '@/actions/createEventForm';
import ContactInfo from './ContactInfo';
import { Button } from '@/components/ui/button';

const EventContactFom = ({
  event,
  id,
  bgColor,
  textStyle,
  setOpen,
}: {
  event: any;
  id: string;
  bgColor?: string;
  textStyle?: string;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [showAlert, setShowAlert] = useState(false);

  const contactForm = useForm<ContactFormDataType>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      message: '',
    },
    mode: 'all',
  });

  const { register, formState, getValues, reset, trigger } = contactForm;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const contactFormValid = await trigger();

      if (contactFormValid) {
        const contactFormData = getValues();
        reset();
        await createEventForm({ id, formValue: contactFormData });
        setShowAlert(true);
      }
    } catch (error) {
      console.error('Error submitting form', error);
      toast.error('Грешка при изпращане на запитването');
    }
  };

  return (
    <section className="max-w-[calc(100%-2rem)] w-full md:max-w-xl mx-auto pb-4 md:pb-6">
      <ContactInfo
        title={event?.contactFormHeading || 'Свържете се с нас!'}
        className={`${textStyle} text-center font-montserrat [&>h4]:md:text-[2rem]`}
      />
      <BasicForm
        register={register}
        handleSubmit={handleSubmit}
        formState={formState}
        bgColor={bgColor}
      />
      {showAlert && (
        <AlertBox
          title="Запитването е изпратено успешно!"
          description="Скоро ще се свържем с вас."
          reset={() => setShowAlert(false)}
          setOpen={setOpen}
        />
      )}
      {/* <Button onClick={() => setOpen(false)}>X</Button> */}
    </section>
  );
};

export default EventContactFom;

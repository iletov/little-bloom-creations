'use client';

import { createContactUs, userDataProps } from '@/actions/createContactUs';
import React, { useState } from 'react';
import './style.css';
// import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Heading } from '../text/Heading';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ContactFormDataType,
  contactSchema,
} from '@/lib/form-validation/validations';
import { ErrorMessage } from '../checkout/checkout-forms/ErrorMessage';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import ContactInfo from './ContactInfo';
import { AlertBox } from '../modals/AlertBox';
import BasicForm from './BasicForm';
import { useAuth } from '@/hooks/useAuth';

interface ContactUsProps {
  contacts?: {
    heading?: string;
    contacts: {
      title: string;
      phone: string;
      email: string;
    }[];
  };
  styledText?: boolean;
  bgColor?: string;
}

export const ContactUs = ({
  contacts,
  styledText = false,
  bgColor,
}: ContactUsProps) => {
  const [showAlert, setShowAlert] = useState(false);
  const { user } = useAuth();

  const userData: userDataProps = {
    id: user?.id ?? '',
    userName: user?.user_metadata?.name ?? '',
    userEmail: user?.email ?? '',
  };

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
        await createContactUs({ userData, formValue: contactFormData });
        setShowAlert(true);
      }
    } catch (error) {
      console.error('Error submitting form', error);
      toast.error('Could not send form');
    }
  };

  return (
    <section className=" max-w-[calc(100%-2rem)] md:max-w-xl mx-auto py-4 md:py-6">
      <header>
        <Heading
          data={contacts?.heading}
          className={`mb-6 md:mb-8 text-[1rem] md:text-[2rem] ${styledText ? 'glossy-text-section' : ''}`}
        />
      </header>

      <div className="flex flex-col gap-4 md:gap-[initial] md:flex-row md:justify-between">
        {contacts?.contacts?.map((contact: any, index: number, array: any) => {
          const lastElementStyle =
            index === array.length - 1 ? 'md:self-end md:text-right' : '';
          return (
            <ContactInfo
              title={contact.title}
              contact={contact}
              key={index + contact.title}
              index={index}
              lastElementStyle={lastElementStyle}
            />
          );
        })}
      </div>
      <BasicForm
        register={register}
        handleSubmit={handleSubmit}
        formState={formState}
        bgColor={bgColor}
      />
      {/* <div className="border-b-[1px] border-slate-200 my-4"></div> */}

      {showAlert && (
        <AlertBox
          title="Успешно изпратено съобщение!"
          description="Скоро ще се свържем с вас."
          reset={() => setShowAlert(false)}
        />
      )}
    </section>
  );
};

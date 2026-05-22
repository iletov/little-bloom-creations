'use client';
import { Input } from '@/components/ui/input';
import React, { useState } from 'react';
import { ErrorMessage } from '../checkout/checkout-forms/ErrorMessage';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

interface BasicFormProps {
  register: any;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  formState: any;
  bgColor?: string;
}

const BasicForm = ({
  register,
  handleSubmit,
  formState,
  bgColor = 'bg-primaryPurple',
}: BasicFormProps) => {
  const [agreeToTerms, setAgreeToTerms] = useState<Boolean>(false);

  let termsTextColor, linkTextColor, accentCollor;
  if (bgColor !== 'bg-primaryPurple') {
    termsTextColor = 'text-primaryPurple';
    linkTextColor = 'text-secondaryPurple hover:text-secondaryPurple/80 ';
    accentCollor = '!accent-secondaryPurple';
  }

  const handleCheckboxChange = () => {
    setAgreeToTerms(!agreeToTerms);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'contact-form border-[1px] border-darkGold w-full p-6 rounded-lg  shadow-md',
        bgColor,
      )}>
      <Input
        {...register('firstName')}
        type="text"
        placeholder="Име"
        className="input_styles_contact"
      />
      {formState.errors.firstName && (
        <ErrorMessage message={formState.errors.firstName.message} />
      )}
      <Input
        {...register('lastName')}
        type="text"
        placeholder="Фамилия"
        className="input_styles_contact"
      />
      {formState.errors.lastName && (
        <ErrorMessage message={formState.errors.lastName.message} />
      )}

      <Input
        {...register('email')}
        type="email"
        placeholder="Имейл"
        className="input_styles_contact"
      />
      {formState.errors.email && (
        <ErrorMessage message={formState.errors.email.message} />
      )}
      <Input
        {...register('phoneNumber')}
        type="text"
        placeholder="Телефон"
        className="input_styles_contact"
      />
      {formState.errors.phoneNumber && (
        <ErrorMessage message={formState.errors.phoneNumber.message} />
      )}

      <Textarea
        {...register('message')}
        placeholder="Съобщение"
        rows={4}
        className="input_styles_contact"
      />
      {formState.errors.message && (
        <ErrorMessage message={formState.errors.message.message} />
      )}

      <div className="flex items-start gap-3">
        <Input
          type="checkbox"
          onChange={handleCheckboxChange}
          className={cn(
            'w-6 h-6 min-h-[revert] !accent-[#D4A017] cursor-pointer',
            accentCollor,
          )}
        />

        <Label className={cn('text-[14px]', termsTextColor)}>
          Съгласявам се личните ми данни да бъдат обработени за целите на
          отговор на запитването ми съгласно условияна на{' '}
          <Link
            href={'/privacy-policy'}
            aria-label="Privacy Policy"
            className={cn(
              'text-mango hover:text-mango/80 transition-all linear',
              linkTextColor,
            )}>
            {' '}
            политиката за поверителност *.
          </Link>
        </Label>
      </div>

      <Button
        variant={'secondary'}
        type="submit"
        disabled={!agreeToTerms}
        // onClick={() => toast.success('Testing!')}
        className="mt-4 w-full text-mango font-montserrat ">
        Изпрати
      </Button>
    </form>
  );
};

export default BasicForm;

'use client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/hooks/useCart';
import {
  PersonlisedFormDataType,
  personlisedFormSchema,
} from '@/lib/form-validation/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '../checkout/checkout-forms/ErrorMessage';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import CustomCheckbox from '../checkbox-container/CustomCheckbox';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { CartIcon2 } from '../icons/icons';

const ProductForm = ({ product }: { product: any }) => {
  const router = useRouter();
  const { addItem } = useCart();

  const personalisedForm = useForm<PersonlisedFormDataType>({
    resolver: zodResolver(personlisedFormSchema),
    defaultValues: {
      addMainText: 'regular',
      textColor: undefined,
      name: '',
    },
  });

  const onSubmit = (data: PersonlisedFormDataType) => {
    addItem(product, data);
    toast.success('Item added to cart', {
      description: 'Now go to your cart.',
      action: {
        label: <div className="px-[1rem] py-[1rem]">{CartIcon2}</div>,
        onClick: () => {
          router.push('/cart');
          toast.dismiss();
        },
      },
    });
    personalisedForm.reset();
  };

  return (
    <form
      onSubmit={personalisedForm.handleSubmit(onSubmit)}
      className="py-4 grid gap-16">
      {/* Main Text regular/ italic/ no text */}
      <div className="space-y-6">
        <p className="text-gray-500">Изберете тип на текст</p>
        <div className="grid md:flex gap-10">
          <Label className="text-[1.6rem] flex cursor-pointer">
            <Input
              type="radio"
              value={'regular'}
              className="peer sr-only"
              {...personalisedForm.register('addMainText')}
            />
            <CustomCheckbox />
            <span className="text-[1.6rem] pl-2">Regular Text</span>
          </Label>
          <Label className="text-[1.6rem] flex cursor-pointer">
            <Input
              type="radio"
              value={'italic'}
              placeholder="Color"
              className="peer sr-only"
              {...personalisedForm.register('addMainText')}
            />
            <CustomCheckbox />
            <span className="text-[1.6rem] pl-2">
              <em>Italic</em>
            </span>
          </Label>

          <Label className="text-[1.6rem] flex cursor-pointer">
            <Input
              type="radio"
              value={'no-text'}
              className="peer sr-only"
              {...personalisedForm.register('addMainText')}
            />
            <CustomCheckbox />
            <span className="text-[1.6rem] pl-2">No Text*</span>
          </Label>
        </div>
      </div>

      {/* Name  */}
      <div className="space-y-6">
        <p className="text-gray-500">* Името, което ще бъде написано</p>
        <div>
          <Input
            {...personalisedForm.register('name')}
            type="text"
            id="name"
            placeholder="Name"
            className="input_styles uppercase placeholder:capitalize text-[1.6rem]"
          />
          {personalisedForm.formState.errors.name && (
            <ErrorMessage
              message={personalisedForm.formState.errors.name.message}
            />
          )}
        </div>
      </div>

      {/* Color */}
      <div className="space-y-6">
        <p className="text-gray-500">* Изберете цвят за текста</p>
        <div className="grid md:flex gap-10">
          <Label className="text-[1.6rem] flex cursor-pointer">
            <Input
              type="radio"
              value={'gold'}
              placeholder="Color"
              className="peer sr-only"
              {...personalisedForm.register('textColor')}
            />
            <CustomCheckbox />
            <span className="text-[1.6rem] pl-2">Gold</span>
          </Label>
          <Label className="text-[1.6rem] flex cursor-pointer">
            <Input
              type="radio"
              value={'silver'}
              placeholder="Color"
              className="peer sr-only"
              {...personalisedForm.register('textColor')}
            />
            <CustomCheckbox />
            <span className="text-[1.6rem] pl-2">Silver</span>
          </Label>
        </div>
        {personalisedForm.formState.errors.textColor && (
          <ErrorMessage
            message={personalisedForm.formState.errors.textColor.message}
          />
        )}
      </div>

      <motion.div
        animate={{ scale: 1 }}
        whileTap={{ scale: 0.96 }}
        transition={{ duration: 0.2 }}
        className=" w-fit flex justify-center items-center">
        <Button
          variant="default"
          type="submit"
          // disabled={stockLimitReached}
          className={`text-green-dark w-auto flex items-center justify-center hover:opacity-[unset]`}>
          Add to Cart
        </Button>
      </motion.div>
    </form>
  );
};

export default ProductForm;

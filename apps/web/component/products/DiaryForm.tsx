'use client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/hooks/useCart';
import {
  PersonlisedFormDataType,
  personlisedFormSchema,
} from '@/lib/form-validation/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '../checkout/checkout-forms/ErrorMessage';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import CustomCheckbox from '../checkbox-container/CustomCheckbox';
import { toast } from 'sonner';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { CartIcon2 } from '../icons/icons';
import { Product } from './types';

const DiaryForm = ({ product }: { product: Product }) => {
  const { addItem, updateItem, variants, items, updateVariants } = useCart();

  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const categorySlug = params?.category as string;

  //check if the product is already in the cart
  const productId = searchParams.get('productId');

  const item = items.find(
    item => item.personalisation?.productId === productId,
  );

  //add product to cart and check if it is a variant of the product

  const currentVariant =
    variants && (variants.product_id === product.id || variants.product_id === product.sku)
      ? variants
      : null;

  const images = currentVariant?.images ?? product?.images ?? null;
  const isInStock = currentVariant ? currentVariant?.current_stock > 0 : true;

  const cartItems = {
    id: currentVariant?.id ?? product.id,
    slug: product?.slug,
    category: { slug: { current: categorySlug || 'all' } },
    sku: product.sku,
    name: product.name,
    price: product.price,
    quantity: 1,
    images,
    color: currentVariant?.color ?? product.color ?? null,
    variant_sku: currentVariant?.variant_sku ?? null,
    variant_name: currentVariant?.variant_name ?? null,
    variant_price: currentVariant?.price ?? null,
    weight: currentVariant?.variant_sku ? currentVariant?.weight : (product.weight ?? null),
    width: currentVariant?.variant_sku ? currentVariant?.width : (product.width ?? null),
    height: currentVariant?.variant_sku ? currentVariant?.height : (product.height ?? null),
    depth: currentVariant?.variant_sku ? currentVariant?.depth : (product.depth ?? null),
  };

  // console.log('Product Form ->', cartItems);

  const personalisedForm = useForm<PersonlisedFormDataType>({
    resolver: zodResolver(personlisedFormSchema),
    defaultValues: {
      addMainText: 'regular',
      textColor: undefined,
      name: '',
    },
  });

  useEffect(() => {
    if (productId && item) {
      personalisedForm.reset({
        addMainText:
          (item.personalisation?.addMainText as
            | 'regular'
            | 'italic'
            | undefined) || 'regular',
        textColor: item.personalisation?.textColor as
          | 'gold'
          | 'silver'
          | undefined,
        name: item.personalisation?.name,
      });

      // Synchronize global variant state with the cart item's variant
      if (item.product) {
        const itemVariantId = item.product.variant_sku || item.product.sku || item.product.id;
        const globalVariantId = variants?.variant_sku || variants?.sku || variants?.id;
        
        if (itemVariantId && itemVariantId !== globalVariantId) {
          updateVariants(item.product);
        }
      }
    }
  }, [productId, item?.personalisation?.productId]);

  //watch form values for changes
  const formValues = personalisedForm.watch();

  const hasCartItemsChanges = item?.product
    ? cartItems.id !== item.product.id ||
      cartItems.color !== item.product.color ||
      cartItems.variant_name !== item.product.variant_name ||
      cartItems.variant_sku !== item.product.variant_sku
    : false;

  const hasPersonalisationChanges = item?.personalisation
    ? formValues.addMainText !== item.personalisation.addMainText ||
      formValues.textColor !== item.personalisation.textColor ||
      formValues.name !== item.personalisation.name
    : false;

  const hasChanges = hasCartItemsChanges || hasPersonalisationChanges;

  const sanitizeData = (data: PersonlisedFormDataType) => {
    if (data.addMainText === null) {
      const { textColor, ...rest } = data;
      return {
        ...rest,
        name: '',
      };
    }
    return data;
  };

  const handleSaveChanges = (data: PersonlisedFormDataType) => {
    const sanitizedData = sanitizeData(data);
    updateItem(productId, cartItems, sanitizedData);
    toast.success('Changes saved', {
      description: 'Continue to your cart.',
      action: {
        label: <div className="px-[1rem] py-[1rem]">{CartIcon2}</div>,
        onClick: () => {
          router.push('/cart');
          toast.dismiss();
        },
      },
    });
  };

  const onSubmit = (data: PersonlisedFormDataType) => {
    const sanitizedData = sanitizeData(data);
    addItem(cartItems, sanitizedData);
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

  const isEditMode = item && productId;

  return (
    <form
      onSubmit={personalisedForm.handleSubmit(
        isEditMode ? handleSaveChanges : onSubmit,
      )}
      className="py-4 grid gap-16">
      {/* Main Text regular/ italic/ no text */}
      <div className="space-y-6">
        <p className="text-gray-500">Изберете тип на текст</p>
        <div className="grid md:flex gap-10">
          <Label className="text-[1.6rem] flex cursor-pointer">
            <Input
              type="radio"
              value={'regular'}
              className="peer hidden"
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
              className="peer hidden"
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
              className="peer hidden"
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
              className="peer hidden"
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
              className="peer hidden"
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
        {isEditMode ? (
          <Button
            variant="default"
            type="submit"
            disabled={!hasChanges || !personalisedForm.formState.isValid}
            className={`text-green-dark w-auto flex items-center justify-center hover:opacity-[unset]`}>
            Save Changes
          </Button>
        ) : (
          <Button
            variant="default"
            type="submit"
            disabled={!personalisedForm.formState.isValid}
            className={`text-green-dark w-auto flex items-center justify-center hover:opacity-[unset]`}>
            Add to Cart
          </Button>
        )}
      </motion.div>
    </form>
  );
};

export default DiaryForm;

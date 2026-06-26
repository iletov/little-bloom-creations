'use client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/hooks/useCart';
import {
  BlanketFormDataType,
  blanketFormSchema,
} from '@/lib/form-validation/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '../../checkout/checkout-forms/ErrorMessage';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import CustomCheckbox from '../../checkbox-container/CustomCheckbox';
import { toast } from 'sonner';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { CartIcon2 } from '../../icons/icons';
import { Product } from '../types';
import EmbroideryModal from './EmbroideryModal';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import { AnimatePresence } from 'framer-motion';
import { X, ZoomIn, Trash2, RefreshCw, Plus } from 'lucide-react';

const BlanketForm = ({ 
  product,
  onAddonPriceChange
}: { 
  product: Product;
  onAddonPriceChange?: (price: number) => void;
}) => {
  const { addItem, updateItem, variants, items, updateVariants } = useCart();

  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const categorySlug = params?.category as string;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);

  //check if the product is already in the cart
  const productId = searchParams.get('productId');

  const item = items.find(
    item => item.personalisation?.productId === productId,
  );

  const currentVariant =
    variants && (variants.product_id === product.id || variants.product_id === product.sku)
      ? variants
      : null;

  const images = currentVariant?.images ?? product?.images ?? null;

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

  const blanketForm = useForm<BlanketFormDataType>({
    resolver: zodResolver(blanketFormSchema),
    defaultValues: {
      personalizationType: 'none',
      name: '',
      embroideryImage: undefined,
    },
  });

  const personalisationData = item?.personalisation as any;

  useEffect(() => {
    if (productId && item) {
      blanketForm.reset({
        personalizationType: personalisationData?.personalizationType || 'none',
        name: personalisationData?.name || '',
        embroideryImage: personalisationData?.embroideryImage,
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

  const formValues = blanketForm.watch();

  const hasCartItemsChanges = item?.product
    ? cartItems.id !== item.product.id ||
      cartItems.color !== item.product.color ||
      cartItems.variant_name !== item.product.variant_name ||
      cartItems.variant_sku !== item.product.variant_sku
    : false;

  const hasPersonalisationChanges = item?.personalisation
    ? formValues.personalizationType !== personalisationData?.personalizationType ||
      formValues.name !== personalisationData?.name ||
      formValues.embroideryImage?.alt !== personalisationData?.embroideryImage?.alt
    : false;

  const hasChanges = hasCartItemsChanges || hasPersonalisationChanges;

  const addonPrice = formValues.personalizationType === 'name-only' 
    ? (product.personalizationOptions?.nameAddonPrice || 0)
    : formValues.personalizationType === 'name-and-embroidery'
      ? (product.personalizationOptions?.embroideryAddonPrice || 0)
      : 0;

  useEffect(() => {
    if (onAddonPriceChange) {
      onAddonPriceChange(addonPrice);
    }
  }, [addonPrice, onAddonPriceChange]);

  const sanitizeData = (data: BlanketFormDataType) => {
    const sanitized = { ...data };
    if (sanitized.personalizationType === 'name-only') {
      sanitized.embroideryImage = undefined;
    } else if (sanitized.personalizationType === 'none') {
      sanitized.name = '';
      sanitized.embroideryImage = undefined;
    }
    return sanitized;
  };

  const handleSaveChanges = (data: BlanketFormDataType) => {
    const sanitizedData = sanitizeData(data);
    updateItem(productId, cartItems, { ...sanitizedData, addonPrice, type: 'blanket' });
    toast.success('Промените са запазени', {
      description: 'Към количката',
      action: {
        label: <div className="px-[1rem] py-[1rem]">{CartIcon2}</div>,
        onClick: () => {
          router.push('/cart');
          toast.dismiss();
        },
      },
    });
  };

  const onSubmit = (data: BlanketFormDataType) => {
    const sanitizedData = sanitizeData(data);
    addItem(cartItems, { ...sanitizedData, addonPrice, type: 'blanket' });
    toast.success('Успешно добавено', {
      description: 'Към количката',
      action: {
        label: <div className="px-[1rem] py-[1rem]">{CartIcon2}</div>,
        onClick: () => {
          router.push('/cart');
          toast.dismiss();
        },
      },
    });
    blanketForm.reset();
  };

  const isEditMode = item && productId;
  
  const embroideryImages = product.personalizationOptions?.embroideryImages || [];

  return (
    <>
      <form
        onSubmit={blanketForm.handleSubmit(
          isEditMode ? handleSaveChanges : onSubmit,
        )}
        className="py-4 grid gap-16">
        
        {/* Personalization Type */}
        <div className="space-y-6">
          <p className="text-gray-500">Изберете тип персонализация</p>
          <div className="grid gap-4">
            <Label className="text-[1.6rem] flex cursor-pointer">
              <Input
                type="radio"
                value={'name-only'}
                className="peer hidden"
                {...blanketForm.register('personalizationType')}
              />
              <CustomCheckbox />
              <span className="text-[1.6rem] pl-2">С име без бродерия {product.personalizationOptions?.nameAddonPrice ? `(+${product.personalizationOptions.nameAddonPrice} €)` : ''}</span>
            </Label>
            
            <Label className="text-[1.6rem] flex cursor-pointer">
              <Input
                type="radio"
                value={'name-and-embroidery'}
                className="peer hidden"
                {...blanketForm.register('personalizationType')}
              />
              <CustomCheckbox />
              <span className="text-[1.6rem] pl-2">С име и бродерия {product.personalizationOptions?.embroideryAddonPrice ? `(+${product.personalizationOptions.embroideryAddonPrice} €)` : ''}</span>
            </Label>

            <Label className="text-[1.6rem] flex cursor-pointer">
              <Input
                type="radio"
                value={'none'}
                className="peer hidden"
                {...blanketForm.register('personalizationType')}
              />
              <CustomCheckbox />
              <span className="text-[1.6rem] pl-2">Без име и без бродерия</span>
            </Label>
          </div>
        </div>

        {/* Name input (Shown if not 'none') */}
        {formValues.personalizationType !== 'none' && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-6">
            <p className="text-gray-500">* Името, което ще бъде написано</p>
            <div>
              <Input
                {...blanketForm.register('name')}
                type="text"
                id="name"
                placeholder="Въведете име"
                className="input_styles uppercase placeholder:capitalize text-[1.6rem]"
              />
              {blanketForm.formState.errors.name && (
                <ErrorMessage
                  message={blanketForm.formState.errors.name.message}
                />
              )}
            </div>
          </motion.div>
        )}

        {/* Embroidery Selection (Shown if 'name-and-embroidery') */}
        {formValues.personalizationType === 'name-and-embroidery' && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-6">
            <p className="text-gray-500">* Изберете бродерия</p>
            <div>
              {formValues.embroideryImage ? (
                <div className="flex items-center gap-6 border-2 p-4 rounded-xl border-green-5 bg-green-1/20">
                  <div 
                    className="relative w-28 h-28 rounded-lg overflow-hidden bg-white shadow-sm border border-green-5 cursor-pointer group"
                    onClick={() => setEnlargedImage(urlFor(formValues.embroideryImage!).url())}
                  >
                    <Image
                      src={urlFor(formValues.embroideryImage).url()}
                      alt={formValues.embroideryImage.alt || 'Бродерия'}
                      fill
                      className="object-cover transition-transform group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <ZoomIn className="text-white w-8 h-8 drop-shadow-md" />
                    </div>
                  </div>
                  
                  <div className="flex flex-col flex-1 gap-3">
                    <span className="text-green-dark font-semibold text-[1.6rem]">
                      {formValues.embroideryImage.alt || 'Избрана бродерия'}
                    </span>
                    <div className="flex gap-3 mt-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="iconLg"
                        onClick={() => setIsModalOpen(true)}
                        className="text-[1.3rem] flex items-center gap-2 border-green-5 text-green-dark hover:bg-green-1"
                      >
                        <RefreshCw size={20} />
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="iconLg"
                        onClick={() => blanketForm.setValue('embroideryImage', undefined, { shouldValidate: true, shouldDirty: true })}
                        className="text-[1.3rem] flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border border-red-200"
                      >
                        <Trash2 size={20} />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="w-full h-auto p-8 text-[1.6rem] bg-transparent border-2 border-dashed border-gray-300 hover:border-green-dark hover:bg-green-1/20 text-gray-500 hover:text-green-dark transition-all rounded-xl flex flex-col items-center justify-center gap-3"
                  onClick={() => setIsModalOpen(true)}
                >
                  <Plus size={28} className="opacity-70" />
                  <span>Кликнете тук, за да изберете бродерия</span>
                </Button>
              )}
              {blanketForm.formState.errors.embroideryImage && (
                <ErrorMessage
                  message={blanketForm.formState.errors.embroideryImage.message as string}
                />
              )}
            </div>
          </motion.div>
        )}

        {/* Submit Button */}
        <motion.div
          animate={{ scale: 1 }}
          whileTap={{ scale: 0.96 }}
          transition={{ duration: 0.2 }}
          className=" w-fit flex justify-center items-center">
          {isEditMode ? (
            <Button
              variant="default"
              type="submit"
              disabled={!hasChanges || !blanketForm.formState.isValid}
              className={`text-green-dark w-auto flex items-center justify-center hover:opacity-[unset]`}>
              Запази Промените
            </Button>
          ) : (
            <Button
              variant="default"
              type="submit"
              disabled={!blanketForm.formState.isValid}
              className={`text-green-dark w-auto flex items-center justify-center hover:opacity-[unset]`}>
              Добави в Количката
            </Button>
          )}
        </motion.div>
      </form>

      <EmbroideryModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        images={embroideryImages}
        onSelect={(img) => {
          blanketForm.setValue('embroideryImage', img, { shouldValidate: true, shouldDirty: true });
        }}
        selectedImageAlt={formValues.embroideryImage?.alt}
      />

      <AnimatePresence>
        {enlargedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
            onClick={() => setEnlargedImage(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-3xl h-[80vh] bg-white rounded-xl overflow-hidden p-2"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={enlargedImage}
                  alt="Уголемена бродерия"
                  fill
                  className="object-contain"
                />
              </div>
              <button 
                onClick={() => setEnlargedImage(null)}
                className="absolute top-4 right-4 bg-white shadow-md rounded-full p-2 text-black hover:bg-gray-200 transition-colors z-10"
              >
                <X size={24} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BlanketForm;

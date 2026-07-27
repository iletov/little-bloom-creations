'use client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/hooks/useCart';
import {
  AcrylicFormDataType,
  acrylicFormSchema,
} from '@/lib/form-validation/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ErrorMessage } from '../../checkout/checkout-forms/ErrorMessage';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import CustomCheckbox from '../../checkbox-container/CustomCheckbox';
import { toast } from 'sonner';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { CartIcon2 } from '../../icons/icons';
import { Product } from '../types';
import EmbroideryModal from './EmbroideryModal';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import { X, ZoomIn, Trash2, RefreshCw, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

const ACRYLIC_COLORS = [
  { name: 'Бял', hex: '#FFFFFF', class: 'bg-white border-gray-200' },
  { name: 'Бебешко Розово', hex: '#FADADD', class: 'bg-[#FADADD] border-[#FADADD]' },
  { name: 'Бебешко Синьо', hex: '#89CFF0', class: 'bg-[#89CFF0] border-[#89CFF0]' },
  { name: 'Ментово Зелено', hex: '#98FF98', class: 'bg-[#98FF98] border-[#98FF98]' },
  { name: 'Лимонено Жълто', hex: '#FFF44F', class: 'bg-[#FFF44F] border-[#FFF44F]' },
  { name: 'Люляк', hex: '#C8A2C8', class: 'bg-[#C8A2C8] border-[#C8A2C8]' },
  { name: 'Праскова', hex: '#FFE5B4', class: 'bg-[#FFE5B4] border-[#FFE5B4]' },
  { name: 'Светло Сив', hex: '#D3D3D3', class: 'bg-[#D3D3D3] border-[#D3D3D3]' },
  { name: 'Черен', hex: '#000000', class: 'bg-black border-black' },
];

const AcrylicForm = ({
  product,
  onAddonPriceChange,
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
  const [openPickerIndex, setOpenPickerIndex] = useState<number | null>(null);

  // Close the balloon color picker when clicking outside
  useEffect(() => {
    if (openPickerIndex === null) return;
    const handleClickOutside = () => setOpenPickerIndex(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openPickerIndex]);

  const productId = searchParams.get('productId');
  const item = items.find(
    (cartItem) => cartItem.personalisation?.productId === productId
  );

  const currentVariant =
    variants &&
    (variants.product_id === product.id || variants.product_id === product.sku)
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
    weight: currentVariant?.variant_sku
      ? currentVariant?.weight
      : product.weight ?? null,
    width: currentVariant?.variant_sku
      ? currentVariant?.width
      : product.width ?? null,
    height: currentVariant?.variant_sku
      ? currentVariant?.height
      : product.height ?? null,
    depth: currentVariant?.variant_sku
      ? currentVariant?.depth
      : product.depth ?? null,
  };

  const form = useForm<AcrylicFormDataType>({
    resolver: zodResolver(acrylicFormSchema),
    defaultValues: {
      colorOption: 'single',
      singleColor: '',
      multipleColors: Array(12).fill(''),
      gradientColor: { start: '', end: '' },
      balloonCount: 12,
      inscriptionMode: 'single',
      inscription: '',
      inscriptions: Array(12).fill(''),
      inscriptionColor: undefined,
      elementImage: undefined,
    },
  });

  const personalisationData = item?.personalisation as any;

  useEffect(() => {
    if (productId && item) {
      form.reset({
        colorOption: personalisationData?.colorOption || 'single',
        singleColor: personalisationData?.singleColor || '',
        multipleColors:
          personalisationData?.multipleColors || Array(12).fill(''),
        gradientColor: personalisationData?.gradientColor || {
          start: '',
          end: '',
        },
        balloonCount: personalisationData?.balloonCount || 12,
        inscriptionMode: personalisationData?.inscriptionMode || 'single',
        inscription: personalisationData?.inscription || '',
        inscriptions: personalisationData?.inscriptions || Array(12).fill(''),
        inscriptionColor: personalisationData?.inscriptionColor || undefined,
        elementImage: personalisationData?.elementImage,
      });

      if (item.product) {
        const itemVariantId =
          item.product.variant_sku || item.product.sku || item.product.id;
        const globalVariantId =
          variants?.variant_sku || variants?.sku || variants?.id;

        if (itemVariantId && itemVariantId !== globalVariantId) {
          updateVariants(item.product);
        }
      }
    }
  }, [productId, item?.personalisation?.productId]);

  const formValues = form.watch();

  useEffect(() => {
    if (formValues.inscriptionMode !== 'per-item') return;

    const selectedInscriptions = formValues.inscriptions
      ?.slice(0, formValues.balloonCount)
      .map((inscription) => inscription.trim())
      .filter(Boolean);
    const inscriptionSummary = selectedInscriptions?.join(', ') ?? '';

    if (formValues.inscription !== inscriptionSummary) {
      form.setValue('inscription', inscriptionSummary, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [
    form,
    formValues.balloonCount,
    formValues.inscription,
    formValues.inscriptionMode,
    formValues.inscriptions,
  ]);

  const hasCartItemsChanges = item?.product
    ? cartItems.id !== item.product.id ||
      cartItems.color !== item.product.color ||
      cartItems.variant_name !== item.product.variant_name ||
      cartItems.variant_sku !== item.product.variant_sku
    : false;

  const hasPersonalisationChanges = item?.personalisation
    ? JSON.stringify(formValues) !==
      JSON.stringify({
        colorOption: personalisationData?.colorOption,
        singleColor: personalisationData?.singleColor,
        multipleColors: personalisationData?.multipleColors,
        gradientColor: personalisationData?.gradientColor,
        balloonCount: personalisationData?.balloonCount,
        inscriptionMode: personalisationData?.inscriptionMode,
        inscription: personalisationData?.inscription,
        inscriptions: personalisationData?.inscriptions,
        inscriptionColor: personalisationData?.inscriptionColor,
        elementImage: personalisationData?.elementImage,
      })
    : false;

  const hasChanges = hasCartItemsChanges || hasPersonalisationChanges;

  const sanitizeData = (data: AcrylicFormDataType) => {
    const sanitized = { ...data };
    if (sanitized.colorOption === 'single') {
      sanitized.multipleColors = undefined;
      sanitized.gradientColor = undefined;
    } else if (sanitized.colorOption === 'multiple') {
      sanitized.singleColor = undefined;
      sanitized.gradientColor = undefined;
      sanitized.multipleColors = sanitized.multipleColors?.slice(
        0,
        sanitized.balloonCount
      );
    } else if (sanitized.colorOption === 'gradient') {
      sanitized.singleColor = undefined;
      sanitized.multipleColors = undefined;
    }
    if (sanitized.inscriptionMode === 'single') {
      sanitized.inscriptions = undefined;
    } else if (sanitized.inscriptionMode === 'per-item') {
      sanitized.inscriptions = sanitized.inscriptions
        ?.slice(0, sanitized.balloonCount)
        .map((inscription) => inscription.trim());
      sanitized.inscription = sanitized.inscriptions?.join(', ') || '';
    }
    return sanitized;
  };

  const getAcrylicColorHex = (colorName: string): string | null =>
    ACRYLIC_COLORS.find((color) => color.name === colorName)?.hex ?? null;

  const getAcrylicColorSelections = (
    colorNames: string[] | undefined,
  ): { name: string; hex: string | null }[] | undefined => {
    const selectedColors = colorNames?.filter((colorName) => colorName.length > 0);

    if (!selectedColors || selectedColors.length === 0) {
      return undefined;
    }

    return selectedColors.map((colorName) => ({
      name: colorName,
      hex: getAcrylicColorHex(colorName),
    }));
  };

  const buildPersonalisationPayload = (data: AcrylicFormDataType) => ({
    ...data,
    singleColorHex: data.singleColor
      ? getAcrylicColorHex(data.singleColor)
      : undefined,
    multipleColorHexes: getAcrylicColorSelections(data.multipleColors),
    type: 'acrylic',
    productId: product.id,
  });

  const updateInscriptionSummary = (
    inscriptions: string[] | undefined,
    balloonCount: number,
  ): void => {
    const inscriptionSummary =
      inscriptions
        ?.slice(0, balloonCount)
        .map((inscription) => inscription.trim())
        .filter(Boolean)
        .join(', ') ?? '';

    form.setValue('inscription', inscriptionSummary, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const validateInscriptions = (data: AcrylicFormDataType): boolean => {
    if (data.inscriptionMode === 'single') {
      if (!data.inscription || data.inscription.trim() === '') {
        form.setError('inscription', {
          type: 'manual',
          message: 'Моля, въведете надпис',
        });
        return false;
      }

      return true;
    }

    if (data.inscriptionMode !== 'per-item') {
      return true;
    }

    const selectedInscriptions = data.inscriptions?.slice(0, data.balloonCount);
    const hasMissingInscription =
      !selectedInscriptions ||
      selectedInscriptions.length < data.balloonCount ||
      selectedInscriptions.some((inscription) => inscription.trim() === '');

    if (hasMissingInscription) {
      form.setError('inscriptions', {
        type: 'manual',
        message: 'Моля, въведете надпис за всяка бройка',
      });
      return false;
    }

    return true;
  };

  const handleSaveChanges = (data: AcrylicFormDataType) => {
    if (!validateInscriptions(data)) {
      return;
    }

    const sanitizedData = sanitizeData(data);
    updateItem(productId, { ...cartItems, quantity: sanitizedData.balloonCount }, {
      ...buildPersonalisationPayload(sanitizedData),
    });
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

  const onSubmit = (data: AcrylicFormDataType) => {
    if (!validateInscriptions(data)) {
      return;
    }

    const sanitizedData = sanitizeData(data);
    addItem({ ...cartItems, quantity: sanitizedData.balloonCount }, {
      ...buildPersonalisationPayload(sanitizedData),
    });
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
  };

  const isEditMode = item && productId;
  const embroideryImages =
    product.personalizationOptions?.embroideryImages || [];
  const hasPerItemColorCustomization = formValues.colorOption === 'multiple';
  const hasPerItemInscriptionCustomization =
    formValues.inscriptionMode === 'per-item';
  const hasPerItemCustomization =
    hasPerItemColorCustomization || hasPerItemInscriptionCustomization;
  const multipleColorsErrorMessage =
    form.formState.errors.multipleColors?.message;
  const inscriptionsErrorMessage =
    form.formState.errors.inscriptions?.message;
  const inscriptionErrorMessage = form.formState.errors.inscription?.message;
  const inscriptionColorErrorMessage =
    form.formState.errors.inscriptionColor?.message;
  

  return (
    <>
      <form
        onSubmit={form.handleSubmit(isEditMode ? handleSaveChanges : onSubmit)}
        className="py-4 grid gap-12"
      >
        {/* Colors Section */}
        <div className="space-y-6">
          <p className="text-gray-500 font-medium">* Изберете стил и цветове</p>

          <div className="grid gap-4 md:grid-cols-3">
            <Label className="text-[1.6rem] flex items-center cursor-pointer p-4 border rounded-xl hover:bg-green-1/10 transition-colors">
              <Input
                type="radio"
                value="single"
                className="peer hidden"
                {...form.register('colorOption')}
              />
              <CustomCheckbox />
              <span className="text-[1.5rem] pl-2">Един цвят за всички</span>
            </Label>
            <Label className="text-[1.6rem] flex items-center cursor-pointer p-4 border rounded-xl hover:bg-green-1/10 transition-colors">
              <Input
                type="radio"
                value="multiple"
                className="peer hidden"
                {...form.register('colorOption')}
              />
              <CustomCheckbox />
              <span className="text-[1.5rem] pl-2">Всеки балон с различен цвят</span>
            </Label>
            <Label className="text-[1.6rem] flex items-center cursor-pointer p-4 border rounded-xl hover:bg-green-1/10 transition-colors">
              <Input
                type="radio"
                value="gradient"
                className="peer hidden"
                {...form.register('colorOption')}
              />
              <CustomCheckbox />
              <span className="text-[1.5rem] pl-2">Градиент</span>
            </Label>
          </div>

          {/* Balloon Count */}
          <div className="mt-6">
            <label className="text-[1.4rem] text-gray-600 block mb-2">
              Брой балони: {formValues.balloonCount}
            </label>
            <input
              type="range"
              min="1"
              max="12"
              step="1"
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              {...form.register('balloonCount', { valueAsNumber: true })}
            />
          </div>

          <motion.div
            key={formValues.colorOption}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            {/* Single Color Picker */}
            {formValues.colorOption === 'single' && (
              <div className="space-y-4">
                <p className="text-[1.4rem] text-gray-600">Изберете цвят:</p>
                <div className="flex flex-wrap gap-4">
                  {ACRYLIC_COLORS.map((c) => (
                    <button
                      type="button"
                      key={c.name}
                      onClick={() =>
                        form.setValue('singleColor', c.name, {
                          shouldValidate: true,
                          shouldDirty: true,
                        })
                      }
                      className={cn(
                        'w-[4rem] h-[4rem] rounded-full  border-white ring-0 transition duration-100 ease-in-out shadow-sm flex items-center justify-center',
                        c.class,
                        formValues.singleColor === c.name
                          ? 'ring-1 ring-offset-2 shadow-lg'
                          : 'opacity-70 hover:opacity-100'
                      )}
                      style={
                        formValues.singleColor === c.name
                          ? { '--tw-ring-color': c.hex } as React.CSSProperties
                          : undefined
                      }
                      title={c.name}
                    />
                  ))}
                </div>
                {form.formState.errors.singleColor && (
                  <ErrorMessage
                    message={form.formState.errors.singleColor.message}
                  />
                )}
              </div>
            )}

            {/* Multiple Colors Picker */}
            {false && formValues.colorOption === 'multiple' && (
              <div className="space-y-6">
                <p className="text-[1.4rem] text-gray-600">
                  Изберете цвят за всяко балонче:
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
                  {Array.from({ length: formValues.balloonCount }).map(
                    (_, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100"
                      >
                        <span className="text-[1.2rem] text-gray-500 font-medium">
                          № {index + 1}
                        </span>
                        <div className="relative">
                          <Controller
                            name={`multipleColors.${index}`}
                            control={form.control}
                            render={({ field }) => {
                              const currentColorInfo = ACRYLIC_COLORS.find(
                                (c) => c.name === field.value
                              );
                              const isOpen = openPickerIndex === index;
                              return (
                                <div>
                                  {/* Balloon color circle — click to open picker */}
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setOpenPickerIndex(isOpen ? null : index);
                                    }}
                                    className={cn(
                                      'w-14 h-14 rounded-full border-2 transition-all shadow-sm flex items-center justify-center cursor-pointer',
                                      currentColorInfo
                                        ? currentColorInfo.class
                                        : 'bg-white border-dashed border-gray-300',
                                      isOpen
                                        ? 'ring-1 ring-offset-2 shadow-lg'
                                        : 'opacity-70 hover:opacity-100'
                                    )}
                                    style={
                                      isOpen && currentColorInfo
                                        ? { '--tw-ring-color': currentColorInfo.hex } as React.CSSProperties
                                        : undefined
                                    }
                                  >
                                    {!currentColorInfo && (
                                      <Plus className="text-gray-400 w-5 h-5" />
                                    )}
                                  </button>

                                  {/* Color Dropdown — visible only when clicked */}
                                  <AnimatePresence>
                                    {isOpen && (
                                      <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: -4 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: -4 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white shadow-xl rounded-xl p-3 border border-gray-100 z-30 w-48"
                                      >
                                        <div className="grid grid-cols-4 gap-2">
                                          {ACRYLIC_COLORS.map((c) => (
                                            <button
                                              type="button"
                                              key={c.name}
                                              onClick={() => {
                                                field.onChange(c.name);
                                                setOpenPickerIndex(null);
                                              }}
                                              className={cn(
                                                'w-8 h-8 rounded-full border border-gray-200 transition-all hover:scale-110',
                                                c.class,
                                                field.value === c.name &&
                                                  'ring-1 ring-offset-2 shadow-lg'
                                              )}
                                              style={
                                                field.value === c.name
                                                  ? { '--tw-ring-color': c.hex } as React.CSSProperties
                                                  : undefined
                                              }
                                              title={c.name}
                                            />
                                          ))}
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              );
                            }}
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>
                {multipleColorsErrorMessage && (
                  <ErrorMessage message={multipleColorsErrorMessage} />
                )}
              </div>
            )}

            {/* Gradient Color Picker */}
            {formValues.colorOption === 'gradient' && (
              <div className="space-y-6">
                <p className="text-[1.4rem] text-gray-600">
                  Изберете цветове за градиент:
                </p>
                <div className="flex flex-col sm:flex-row gap-8 items-center bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <div className="space-y-3 flex-1 w-full">
                    <span className="text-[1.3rem] text-gray-500 font-medium block">
                      Начален цвят
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {ACRYLIC_COLORS.map((c) => (
                        <button
                          type="button"
                          key={c.name}
                          onClick={() =>
                            form.setValue('gradientColor.start', c.hex, {
                              shouldValidate: true,
                              shouldDirty: true,
                            })
                          }
                          className={cn(
                            'w-8 h-8 rounded-full border border-gray-200 transition-all hover:scale-110',
                            c.class,
                            formValues.gradientColor?.start === c.hex &&
                              'ring-1 ring-offset-2 shadow-lg'
                          )}
                          style={
                            formValues.gradientColor?.start === c.hex
                              ? { '--tw-ring-color': c.hex } as React.CSSProperties
                              : undefined
                          }
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="w-full sm:w-48 h-16 rounded-xl border-2 border-gray-200 shadow-inner flex items-center justify-center bg-white overflow-hidden relative">
                    {formValues.gradientColor?.start &&
                    formValues.gradientColor?.end ? (
                      <div
                        className="absolute inset-0 w-full h-full opacity-90"
                        style={{
                          background: `linear-gradient(90deg, ${formValues.gradientColor.start} 0%, ${formValues.gradientColor.end} 100%)`,
                        }}
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">
                        Изберете 2 цвята
                      </span>
                    )}
                  </div>

                  <div className="space-y-3 flex-1 w-full">
                    <span className="text-[1.3rem] text-gray-500 font-medium block text-left sm:text-right">
                      Краен цвят
                    </span>
                    <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
                      {ACRYLIC_COLORS.map((c) => (
                        <button
                          type="button"
                          key={c.name}
                          onClick={() =>
                            form.setValue('gradientColor.end', c.hex, {
                              shouldValidate: true,
                              shouldDirty: true,
                            })
                          }
                          className={cn(
                            'w-8 h-8 rounded-full border border-gray-200 transition-all hover:scale-110',
                            c.class,
                            formValues.gradientColor?.end === c.hex &&
                              'ring-1 ring-offset-2 shadow-lg'
                          )}
                          style={
                            formValues.gradientColor?.end === c.hex
                              ? { '--tw-ring-color': c.hex } as React.CSSProperties
                              : undefined
                          }
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                {form.formState.errors.gradientColor && (
                  <ErrorMessage
                    message={form.formState.errors.gradientColor.message}
                  />
                )}
              </div>
            )}
          </motion.div>
        </div>

        {hasPerItemCustomization && (
          <div className="space-y-6 pt-6 border-t border-slate-100">
            <p className="text-gray-500 font-medium">
              * Персонализация за всяка отделна бройка
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {Array.from({ length: formValues.balloonCount }).map((_, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100"
                >
                  <span className="text-[1.3rem] text-gray-500 font-semibold">
                    #{index + 1}
                  </span>

                  {hasPerItemColorCustomization && (
                    <div className="space-y-2 flex justify-between items-center">
                      <span className="text-[1.2rem] text-gray-500 font-medium">
                        Цвят
                      </span>
                      <div className="relative">
                        <Controller
                          name={`multipleColors.${index}`}
                          control={form.control}
                          render={({ field }) => {
                            const currentColorInfo = ACRYLIC_COLORS.find(
                              (color) => color.name === field.value,
                            );
                            const isOpen = openPickerIndex === index;

                            return (
                              <div>
                                <button
                                  type="button"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    setOpenPickerIndex(isOpen ? null : index);
                                  }}
                                  className={cn(
                                    'w-14 h-14 rounded-full border-2 transition-all shadow-sm flex items-center justify-center cursor-pointer',
                                    currentColorInfo
                                      ? currentColorInfo.class
                                      : 'bg-white border-dashed border-gray-300',
                                    isOpen
                                      ? 'ring-1 ring-offset-2 shadow-lg'
                                      : 'opacity-70 hover:opacity-100',
                                  )}
                                  style={
                                    isOpen && currentColorInfo
                                      ? { '--tw-ring-color': currentColorInfo.hex } as React.CSSProperties
                                      : undefined
                                  }
                                >
                                  {!currentColorInfo && (
                                    <Plus className="text-gray-400 w-5 h-5" />
                                  )}
                                </button>

                                <AnimatePresence>
                                  {isOpen && (
                                    <motion.div
                                      initial={{ opacity: 0, scale: 0.95, y: -4 }}
                                      animate={{ opacity: 1, scale: 1, y: 0 }}
                                      exit={{ opacity: 0, scale: 0.95, y: -4 }}
                                      transition={{ duration: 0.15 }}
                                      className="absolute top-full left-0 mt-2 bg-white shadow-xl rounded-xl p-3 border border-gray-100 z-30 w-48"
                                    >
                                      <div className="grid grid-cols-4 gap-2">
                                        {ACRYLIC_COLORS.map((color) => (
                                          <button
                                            type="button"
                                            key={color.name}
                                            onClick={() => {
                                              field.onChange(color.name);
                                              setOpenPickerIndex(null);
                                            }}
                                            className={cn(
                                              'w-8 h-8 rounded-full border border-gray-200 transition-all hover:scale-110',
                                              color.class,
                                              field.value === color.name &&
                                                'ring-1 ring-offset-2 shadow-lg',
                                            )}
                                            style={
                                              field.value === color.name
                                                ? { '--tw-ring-color': color.hex } as React.CSSProperties
                                                : undefined
                                            }
                                            title={color.name}
                                          />
                                        ))}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {hasPerItemInscriptionCustomization && (
                    <div className="space-y-2">
                      <Label
                        htmlFor={`inscription-${index}`}
                        className="text-[1.2rem] text-gray-500 font-medium"
                      >
                        Надпис
                      </Label>
                      <Input
                        {...form.register(`inscriptions.${index}`, {
                          onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
                            const currentInscriptions =
                              form.getValues('inscriptions') ?? Array(12).fill('');
                            const nextInscriptions = [...currentInscriptions];
                            nextInscriptions[index] = event.target.value;
                            updateInscriptionSummary(
                              nextInscriptions,
                              formValues.balloonCount,
                            );
                          },
                        })}
                        type="text"
                        id={`inscription-${index}`}
                        placeholder={`${index + 1} или месец`}
                        className="input_styles uppercase placeholder:capitalize text-[1.5rem]"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
            {multipleColorsErrorMessage && (
              <ErrorMessage message={multipleColorsErrorMessage} />
            )}
            {inscriptionsErrorMessage && (
              <ErrorMessage message={inscriptionsErrorMessage} />
            )}
          </div>
        )}

        {/* Inscription Section */}
        <div className="space-y-6 pt-6 border-t border-slate-100">
          <p className="text-gray-500 font-medium">* Въведете надпис за продукта</p>
          <div className="grid gap-4 md:grid-cols-2">
            <Label className="text-[1.6rem] flex items-center cursor-pointer p-4 border rounded-xl hover:bg-green-1/10 transition-colors">
              <Input
                type="radio"
                value="single"
                className="peer hidden"
                {...form.register('inscriptionMode')}
              />
              <CustomCheckbox />
              <span className="text-[1.5rem] pl-2">Един надпис за всички</span>
            </Label>
            <Label className="text-[1.6rem] flex items-center cursor-pointer p-4 border rounded-xl hover:bg-green-1/10 transition-colors">
              <Input
                type="radio"
                value="per-item"
                className="peer hidden"
                {...form.register('inscriptionMode')}
              />
              <CustomCheckbox />
              <span className="text-[1.5rem] pl-2">Различен надпис за всяка бройка</span>
            </Label>
          </div>
          <div className={formValues.inscriptionMode === 'per-item' ? 'hidden' : undefined}>
            <Input
              {...form.register('inscription')}
              type="text"
              id="inscription"
              placeholder="Надпис"
              className="input_styles uppercase placeholder:capitalize text-[1.6rem]"
            />
            {inscriptionErrorMessage && (
              <ErrorMessage message={inscriptionErrorMessage} />
            )}
          </div>

          {false && formValues.inscriptionMode === 'per-item' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {Array.from({ length: formValues.balloonCount }).map((_, index) => (
                  <div key={index} className="space-y-2">
                    <Label
                      htmlFor={`inscription-${index}`}
                      className="text-[1.2rem] text-gray-500 font-medium"
                    >
                      #{index + 1}
                    </Label>
                    <Input
                      {...form.register(`inscriptions.${index}`, {
                        onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
                          const currentInscriptions =
                            form.getValues('inscriptions') ?? Array(12).fill('');
                          const nextInscriptions = [...currentInscriptions];
                          nextInscriptions[index] = event.target.value;
                          updateInscriptionSummary(
                            nextInscriptions,
                            formValues.balloonCount,
                          );
                        },
                      })}
                      type="text"
                      id={`inscription-${index}`}
                      placeholder={`${index + 1} или месец`}
                      className="input_styles uppercase placeholder:capitalize text-[1.5rem]"
                    />
                  </div>
                ))}
              </div>
              {inscriptionErrorMessage && (
                <ErrorMessage message={inscriptionErrorMessage} />
              )}
              {inscriptionsErrorMessage && (
                <ErrorMessage message={inscriptionsErrorMessage} />
              )}
            </div>
          )}
        </div>

        {/* Inscription Color Section */}
        <div className="space-y-6 pt-6 border-t border-slate-100">
          <p className="text-gray-500 font-medium">* Изберете цвят на надписа</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Label className="text-[1.6rem] flex cursor-pointer items-center py-3 px-5 border rounded-xl hover:bg-slate-50">
              <Input
                type="radio"
                value={'gold'}
                className="peer hidden"
                {...form.register('inscriptionColor')}
              />
              <CustomCheckbox />
              <span className="text-[1.5rem] pl-2 font-medium bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                Златен
              </span>
            </Label>
            <Label className="text-[1.6rem] flex cursor-pointer items-center py-3 px-5 border rounded-xl hover:bg-slate-50">
              <Input
                type="radio"
                value={'silver'}
                className="peer hidden"
                {...form.register('inscriptionColor')}
              />
              <CustomCheckbox />
              <span className="text-[1.5rem] pl-2 font-medium text-gray-400">
                Сребърен
              </span>
            </Label>
            <Label className="text-[1.6rem] flex cursor-pointer items-center py-3 px-5 border rounded-xl hover:bg-slate-300 bg-slate-200">
              <Input
                type="radio"
                value={'white'}
                className="peer hidden"
                {...form.register('inscriptionColor')}
              />
              <CustomCheckbox />
              <span className="text-[1.5rem] pl-2 font-medium">Бял</span>
            </Label>
            <Label className="text-[1.6rem] flex cursor-pointer items-center py-3 px-5 rounded-xl hover:bg-gray-600 bg-gray-500">
              <Input
                type="radio"
                value={'black'}
                className="peer hidden"
                {...form.register('inscriptionColor')}
              />
              <CustomCheckbox />
              <span className="text-[1.5rem] pl-2 font-medium text-white">
                Черен
              </span>
            </Label>
          </div>
          {inscriptionColorErrorMessage && (
            <ErrorMessage message={inscriptionColorErrorMessage} />
          )}
        </div>

        {/* Element Selection */}
        <div className="space-y-6 pt-6 border-t border-slate-100">
          <p className="text-gray-500 font-medium">Изберете елемент</p>
          <div>
            {formValues.elementImage ? (
              <div className="flex items-center gap-6 border-2 p-4 rounded-xl border-green-5 bg-green-1/20">
                <div
                  className="relative w-28 h-28 rounded-lg overflow-hidden bg-white shadow-sm border border-green-5 cursor-pointer group"
                  onClick={() =>
                    setEnlargedImage(urlFor(formValues.elementImage!).url())
                  }
                >
                  <Image
                    src={urlFor(formValues.elementImage).url()}
                    alt={formValues.elementImage.alt || 'Избран елемент'}
                    fill
                    className="object-cover transition-transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <ZoomIn className="text-white w-8 h-8 drop-shadow-md" />
                  </div>
                </div>

                <div className="flex flex-col flex-1 gap-3">
                  <span className="text-green-dark font-semibold text-[1.6rem]">
                    {formValues.elementImage.alt || 'Избран елемент'}
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
                      onClick={() =>
                        form.setValue('elementImage', undefined, {
                          shouldValidate: true,
                          shouldDirty: true,
                        })
                      }
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
                <span>Кликнете тук, за да изберете елемент</span>
              </Button>
            )}
            {form.formState.errors.elementImage && (
              <ErrorMessage
                message={form.formState.errors.elementImage.message as string}
              />
            )}
          </div>
        </div>

        {/* Submit Button */}
        <motion.div
          animate={{ scale: 1 }}
          whileTap={{ scale: 0.96 }}
          transition={{ duration: 0.2 }}
          className="w-fit flex justify-center items-center pt-6"
        >
          <Button
            variant="default"
            type="submit"
            disabled={isEditMode ? !hasChanges : false}
            className={`text-green-dark w-auto flex items-center justify-center hover:opacity-[unset]`}
          >
            {isEditMode ? 'Запази Промените' : 'Добави в Количката'}
          </Button>
        </motion.div>
      </form>

      <EmbroideryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        images={embroideryImages}
        onSelect={(img) => {
          form.setValue('elementImage', img, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }}
        selectedImageAlt={formValues.elementImage?.alt}
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
                  alt="Уголемен елемент"
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

export default AcrylicForm;

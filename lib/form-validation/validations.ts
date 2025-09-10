import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export type AddressFormDataType = {
  country: string;
  city: string;
  postalCode: string;
  phoneNumber: string;
  street?: string; // Make address optional
  streetNumber?: string; // Make address optional
  other?: string;
};

export const guestSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: 'First name must be at least 2 characters' }),
  lastName: z
    .string()
    .min(2, { message: 'Last name must be at least 2 characters' }),
  email: z.string().email(),
});

export const fullAddress = z.object({
  country: z.string().min(2, { message: 'Country is required' }),
  city: z.string().min(2, { message: 'City is required' }),
  // street: z.string().min(2, { message: 'Street is required' }),
  street: z.string().optional(),
  streetNumber: z.string().optional(),
  other: z.string().optional(),
  postalCode: z.string().regex(/^\d+$/, { message: 'Postal code is invalid' }),
  phoneNumber: z
    .string()
    .regex(/^[0-9]{9,10}$/, { message: 'Phone number is required' }),
  officeCode: z.string().optional(),
});

export const contactSchema = z.object({
  firstName: z.string().min(2, { message: 'First name is required' }),
  lastName: z.string().min(2, { message: 'Last name is required' }),
  email: z.string().email(),
  phoneNumber: z
    .string()
    .regex(/^[0-9]{9,10}$/, { message: 'Phone number is required' }),
  message: z.string().min(2, { message: 'Message is required' }),
});

export type GuestFormDataType = z.infer<typeof guestSchema>;
// export type noAddressType = z.infer<typeof noAddress>;
export type fullAddressType = z.infer<typeof fullAddress>;
// export type formSchemaType = ReturnType<typeof formSchema>;
export type ContactFormDataType = z.infer<typeof contactSchema>;

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
  blockNo?: string;
  entranceNo?: string;
  floorNo?: string;
  apartmentNo?: string;
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
  officeCode: z.union([z.string(), z.number()]).optional(),
  blockNo: z.string().optional(),
  entranceNo: z.string().optional(),
  floorNo: z.string().optional(),
  apartmentNo: z.string().optional(),
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

export const personlisedFormSchema = z.object({
  // productId: z.string(),
  addMainText: z
    .union([
      z.enum(['regular', 'italic']),
      z.literal('no-text').transform(() => null),
    ])
    .optional(),
  textColor: z.enum(['gold', 'silver'], {
    errorMap: () => ({ message: 'Моля, изберете цвят' }),
  }),

  name: z
    .string({ required_error: 'Моля, въведете име' })
    .trim()
    .nonempty('Моля, въведете име')
    .regex(/^[\u0400-\u04FF\s-]+$/, 'Използвайте само български букви'),
});

export type GuestFormDataType = z.infer<typeof guestSchema>;
// export type noAddressType = z.infer<typeof noAddress>;
export type fullAddressType = z.infer<typeof fullAddress>;
// export type formSchemaType = ReturnType<typeof formSchema>;
export type ContactFormDataType = z.infer<typeof contactSchema>;

export type PersonlisedFormDataType = z.infer<typeof personlisedFormSchema>;

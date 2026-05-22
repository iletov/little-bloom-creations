'use server';

import { backendClient } from '@/sanity/lib/backendClient';

export interface ContactUsProps {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  message: string;
}

export interface userDataProps {
  id: string;
  userName: string;
  userEmail: string;
}

export const createContactUs = async ({
  userData,
  formValue,
}: {
  userData: userDataProps;
  formValue: ContactUsProps;
}) => {
  const sendForm = await backendClient.create({
    _type: 'contactForm',
    userId: userData.id || 'N/A',
    registeredName: userData.userName || 'N/A',
    registeredEmail: userData.userEmail || 'N/A',
    firstName: formValue.firstName,
    lastName: formValue.lastName,
    email: formValue.email,
    phoneNumber: formValue.phoneNumber || '',
    message: formValue.message,
  });

  return sendForm;
};

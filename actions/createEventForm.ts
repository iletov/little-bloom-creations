'use server';

import { backendClient } from '@/sanity/lib/backendClient';
import { ContactUsProps, userDataProps } from './createContactUs';

export const createEventForm = async ({
  id,
  formValue,
}: {
  id: string;
  formValue: ContactUsProps;
}) => {
  const sendForm = await backendClient
    .patch(id)
    .setIfMissing({ messages: [] })
    .append('messages', [
      {
        _type: 'message',
        _key: crypto.randomUUID(),
        name: formValue.firstName + ' ' + formValue.lastName,
        email: formValue.email,
        phone: formValue.phoneNumber,
        message: formValue.message,
        createdAt: new Date().toISOString(),
      },
    ])
    .commit();

  return sendForm;
};

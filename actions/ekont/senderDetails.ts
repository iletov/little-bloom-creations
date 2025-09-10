'use server';

import { getEkontSenderDetails } from '@/sanity/lib/ekont/senderDetails';

export const senderInfo = async () => {
  const data = await getEkontSenderDetails();

  console.log(
    'Environment variable check:',
    !!process.env.SANITY_API_READ_TOKEN,
  );

  // console.log('SENDER INFO', data);

  return data;
};

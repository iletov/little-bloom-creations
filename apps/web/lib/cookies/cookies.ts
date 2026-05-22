import { cookies } from 'next/headers';

export const getCookieConsent = async () => {
  const cookieStore = await cookies();
  return cookieStore.get('cookie_consent')?.value || null;
};

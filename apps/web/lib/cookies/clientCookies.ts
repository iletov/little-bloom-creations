import Cookies from 'js-cookie';

export const setConsentCookie = (value: 'accepted' | 'denied') => {
  Cookies.set('cookie_consent', value, { expires: 365 });
};

export const getConsentCookie = () => {
  return Cookies.get('cookie_consent');
};

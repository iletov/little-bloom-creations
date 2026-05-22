'use client';

import { Button } from '@/components/ui/button';
import {
  getConsentCookie,
  setConsentCookie,
} from '@/lib/cookies/clientCookies';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = getConsentCookie();
    if (!consent) setShowBanner(true);
  }, []);

  const handleConsent = (choice: 'accepted' | 'denied') => {
    setConsentCookie(choice);
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <section className="fixed bottom-0 right-0 grid gap-2 md:w-fit w-full min-w-[360px] rounded-xl bg-[#47324e]  py-4 px-5 z-50">
      <h3 className="text-mango text-[1.5rem] font-play font-semibold md:text-[1.725rem] uppercase">
        Този сайт използва "бисквитки".
      </h3>
      <p className="mb-4 font-montserrat">
        Този сайт използва съществени "бисквитки", необходими за неговото
        правилно функциониране.
      </p>
      <p className="font-comfortaa space-x-2 ">
        <span>Научете повече на</span>
        <Link
          href="/privacy-policy"
          aria-label="Privacy Policy"
          className="text-mango hover:text-mango/80 transition-all linear">
          Политика за поверителност
        </Link>
      </p>

      <div className="flex ">
        <Button
          variant={'default'}
          onClick={() => handleConsent('accepted')}
          className="mr-2 px-4 py-2 bg-darkGold text-foreground hover:bg-darkGold/70">
          Приемам
        </Button>
        {/* <Button
          onClick={() => handleConsent('denied')}
          className="px-4 py-2 bg-gray-700 text-foreground hover:bg-gray-700/70">
          Откажи
        </Button> */}
      </div>
    </section>
  );
}

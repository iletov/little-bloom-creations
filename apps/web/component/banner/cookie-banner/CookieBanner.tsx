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
    <section className="fixed bottom-4 right-4 md:bottom-8 md:right-8 grid gap-2 md:w-fit w-[calc(100%-2rem)] max-w-[400px] rounded-[0.8rem] bg-white border border-green-1/20 shadow-xl py-5 px-6 z-50">
      <h3 className="text-green-dark text-[1.25rem] font-semibold mb-1">
        Управление на бисквитките
      </h3>
      <p className="mb-4 text-slate-600 text-sm leading-relaxed">
        Този сайт използва съществени "бисквитки", необходими за неговото
        правилно функциониране и за да ви предоставим най-доброто преживяване.
      </p>
      <p className="text-sm space-x-1 mb-2">
        <span className="text-slate-500">Научете повече в нашата</span>
        <Link
          href="/privacy-policy"
          aria-label="Privacy Policy"
          className="text-green-dark underline hover:text-green-5 transition-all">
          Политика за поверителност
        </Link>
      </p>

      <div className="flex gap-3 mt-2">
        <Button
          onClick={() => handleConsent('accepted')}
          className="flex-1 bg-green-5 hover:bg-green-dark text-white rounded-full">
          Приемам
        </Button>
        <Button
          variant="outline"
          onClick={() => handleConsent('denied')}
          className="flex-1 rounded-full text-slate-600 border-slate-300 hover:bg-slate-50">
          Откажи
        </Button>
      </div>
    </section>
  );
}

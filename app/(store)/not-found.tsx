import Link from 'next/link';
import React from 'react';

export default function GlobalNotFound() {
  return (
    <div className="min-h-[calc(100dvh-69px)] flex items-center justify-center other-bg_gradient">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4 text-mango">404</h1>
        <p className="text-xl mb-8">Page not found</p>
        <Link href="/">
          <p className="text-lightBlue underline">Go back home</p>
        </Link>
      </div>
    </div>
  );
}

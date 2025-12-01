import type { Metadata } from 'next';
import {
  Geist,
  Geist_Mono,
  Monsieur_La_Doulaise,
  Montserrat_Alternates,
} from 'next/font/google';
import './globals.css';
// import Header from "@/Components/header/Header;
import { SanityLive } from '@/sanity/lib/live';

import StoreProvider from '../store/StoreProvider';
import { Toaster } from '@/components/ui/sonner';
import Header from '@/component/header/Header';
import QueryProvider from './query-provider';
import LayoutWrapper from './query-wrapper';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const montserrat = Montserrat_Alternates({
  variable: '--font-montserrat-alternates',
  subsets: ['latin'],
  display: 'swap',
  // You can also specify weight if needed
  weight: ['400', '500', '600', '700'],
});

const monsieurLa = Monsieur_La_Doulaise({
  variable: '--font-monsieur-la-doulaise',
  subsets: ['latin'],
  display: 'swap',
  // You can also specify weight if needed
  weight: ['400'],
});

// export async function generateMetadata(): Promise<Metadata> {
//   const settings = await getBannerBySlug('/');
//   return {
//     title: {
//       default: 'Невена Цонева',
//       template: '%s | Невена Цонева',
//     },
//     description: 'Официален сайт на Невена Цонева',
//     keywords: ['Невена Цонева', 'Баш Бенд', 'Без Граници', 'Гадателски карти'],
//     authors: [{ name: 'Невена Цонева' }],
//     creator: 'Невена Цонева',
//     openGraph: {
//       title: 'Невена Цонева',
//       description: 'Официален сайт на Невена Цонева',
//       url: process.env.NEXT_PUBLIC_SITE_URL,
//       siteName: 'Невена Цонева',
//       locale: 'bg-BG',
//       type: 'website',
//       images: [
//         {
//           url: urlFor(settings?.bannerImage?.[0]).width(1200).height(630).url() ,
//           width: 1200,
//           height: 630,
//           alt: 'Невена Цонева',
//         },
//       ],
//     },
//     twitter: {
//       card: 'summary_large_image',
//       title: 'Невена Цонева',
//       description: 'Официален сайт на Невена Цонева',
//       creator: '@nevenatsoneva',
//       images: [
//         {
//           url: urlFor(settings?.bannerImage?.[0]).width(1200).height(630).url(),
//           width: 1200,
//           height: 630,
//           alt: 'Невена Цонева',
//         },
//       ],
//     },
//     robots: {
//       index: true,
//       follow: true,
//       googleBot: {
//         index: true,
//         follow: true,
//         'max-video-preview': -1,
//         'max-image-preview': 'large',
//         'max-snippet': -1,
//       },
//     },
//   };
// }

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${monsieurLa.variable}  ${geistSans.variable} ${geistMono.variable} ${montserrat.variable} antialiased tracking-tight font-sans flex flex-col min-h-screen light `}>
        <LayoutWrapper>
          <StoreProvider>
            <main className="flex flex-col">
              <Header />
              <div className="">
                {children}
                {/* <CookieConsentBanner /> */}
              </div>
            </main>
            <SanityLive />
            <Toaster />
          </StoreProvider>
        </LayoutWrapper>
      </body>
    </html>
  );
}

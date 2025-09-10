import type { Metadata } from 'next';
import {
  Comfortaa,
  Geist,
  Geist_Mono,
  Montserrat_Alternates,
  Play,
} from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
// import Header from "@/Components/header/Header;
import { SanityLive } from '@/sanity/lib/live';
import Header from '@/component/header/Header';
import Footer from '@/component/footer/Footer';
import StoreProvider from '../store/StoreProvider';
import { Toaster } from '@/components/ui/sonner';
import { getLayoutData } from '@/lib/cms/getLayoutData';
import { getBannerBySlug } from '@/sanity/lib/banner/getBannerByTitle';
import { urlFor } from '@/sanity/lib/image';
import { getSocialMediaIcons } from '@/sanity/lib/sections/getSocialMediaIcons';

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

// const orbitron = Orbitron({
//   variable: '--font-orbitron',
//   subsets: ['latin'],
//   display: 'swap',
//   // You can also specify weight if needed
//   weight: ['400', '500', '600', '700'],
// });
const play = Play({
  variable: '--font-play',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '700'],
});
const comfortaa = Comfortaa({
  variable: '--font-comfortaa',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '700'],
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
        className={`${play.variable} ${comfortaa.variable} ${geistSans.variable} ${geistMono.variable} ${montserrat.variable} antialiased tracking-tight font-sans flex flex-col min-h-screen dark `}>
        <StoreProvider>
          <ClerkProvider dynamic>
            <main className="flex flex-col">
              <div className="border-b-[1px] border-secondaryPurple ">
                {children}
                {/* <CookieConsentBanner /> */}
              </div>
            </main>
            <SanityLive />
            <Toaster />
          </ClerkProvider>
        </StoreProvider>
      </body>
    </html>
  );
}

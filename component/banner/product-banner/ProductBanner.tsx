import { Button } from '@/components/ui/button';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface ProductBannerProps {
  data: any;
}

export const ProductBanner = ({ data }: ProductBannerProps) => {
  return (
    <section className="relative mt-2 w-auto mx-3 xl:max-w-[calc(100%-20rem)] flex md:mx-auto h-[38rem] xl:h-[25rem] overflow-hidden rounded-[16px] ">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>

      {/* Team Name */}
      {/* <div className="absolute top-2 left-4 z-20">
        <span className="text-yellow-400 text-sm font-bold tracking-wider">
          Място за текст
        </span>
      </div> */}

      {/* Main Content Container */}
      <div className="relative w-full flex flex-col xl:flex-row items-center">
        {/* Large Welcome Text - Behind Image */}
        <div className="w-full h-full flex-1 order-2 xl:order-1 flex flex-col items-center justify-center z-0">
          <header className="text-white uppercase font-play font-normal flex flex-col items-center justify-center w-full text-[72px] xsm:text-[82] xl:text-[105px] xl2:text-[120px] pt-5 tracking-wide leading-none opacity-30 glossy-text-banner">
            <span>Невена</span>
            {/* <br /> */}
            <span>Цонева</span>
          </header>

          <div className="flex flex-col items-center justify-center translate-y-[-60%]">
            <span className="text-darkBlue text-[1rem] font-bold italic font-montserrat">
              гадателски карти
            </span>
            <span className="text-mango font-play text-4xl md:text-6xl font-semibold tracking-wider">
              Без Граници
            </span>
            <Link
              href="https://www.nevenatsoneva.store"
              target="_blank"
              aria-label="Buy Now"
              className="z-20 mt-6">
              <Button className="bg-darkBlue hover:bg-darkBlue/80 px-8 py-5 skew-x-[-12deg] shadow-lg">
                <span className="text-mango font-bold text-lg tracking-wider skew-x-[12deg] block">
                  Купете сега
                </span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="relative order-1 xl:order-2 flex-1 w-full h-full  flex items-center justify-center z-10">
          {data?.bannerImage?.length > 0 && (
            <div className="relative w-full h-full max-w-[350px] max-h-[350px] lg:max-w-[420px] lg:max-h-[420px] xl:max-w-[460px] xl:max-h-[460px] xl2:max-w-[500px] xl2:max-h-[500px]">
              <Image
                src={urlFor(data?.bannerImage?.[0] ?? []).url()}
                alt="Player"
                fill={true}
                sizes="(max-width: 768px) 100vw, 800px"
                className="object-cover object-top lg:object-center aspect-square block"
                priority
              />
            </div>
          )}

          {/* Yellow Label Overlay */}
        </div>

        {/* Right Side - Additional Text */}
        {/* <div className="absolute top-2 right-4 z-10 hidden xl:block">
          <span className="text-yellow-400 text-sm font-bold tracking-wider">
            Място за текст
          </span>
        </div> */}
      </div>

      {/* Decorative Elements */}
      {/* <div className="absolute top-8 right-8 text-yellow-400 text-2xl font-bold opacity-50">
        ×
      </div>
      <div className="absolute bottom-8 left-8 text-yellow-400 text-xl font-bold opacity-50">
        ×
      </div>
      <div className="absolute top-1/2 right-4 text-yellow-400 text-lg font-bold opacity-30 transform rotate-45">
        ×
      </div> */}
    </section>
  );
};

import React from 'react';
import { SidebarProps } from './Sidebar';
import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import { SocialMediaType } from '@/sanity.types';

export const SocialLinks = ({
  data,
  onLinkClickAction,
}: {
  data?: Array<SocialMediaType>;
  onLinkClickAction?: () => void;
}) => {
  return (
    <section className="flex gap-6 justify-center">
      {data?.map((link: any, index: number) => (
        <Link href={link?.url} key={index} onClick={onLinkClickAction}>
          <article
            key={index}
            onClick={onLinkClickAction}
            typeof="button"
            className="font-montserrat tracking-wide text-[1rem] gap-3 sm:text-[1.6rem] hover:text-darkGold transition-colors easy-in-out">
            <div className="flex gap-6 items-center">
              {/* <span className="text-slate-200/30 ">{link?.icon}</span>{' '} */}
              <div className="w-10 h-10  hover:opacity-70 transition ease-linear">
                <Image
                  src={urlFor(link?.icon).url()}
                  alt={link?.title}
                  width={10}
                  height={10}
                  className="w-full h-full p-2.5 object-cover opacity-80"
                />
              </div>
            </div>
          </article>
        </Link>
      ))}
    </section>
  );
};

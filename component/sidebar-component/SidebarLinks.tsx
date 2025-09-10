'use client';
import React, { useState } from 'react';
import { SidebarProps } from './Sidebar';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import Link from 'next/link';
import { ChevronDown, Plus } from 'lucide-react';

export const SidebarLinks = ({
  data,
  onLinkClickAction,
}: {
  data?: SidebarProps;
  onLinkClickAction: () => void;
}) => {
  const [expandedSection, setexpandedSection] = useState<{
    [key: number]: boolean;
  }>({});

  const toggleExpand = (index: number) => {
    setexpandedSection(prevState => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  return (
    <section className="flex w-full flex-col gap-3 sm:gap-0">
      {data?.links?.map((link: any, index: number) => {
        const isExpanded = expandedSection[index] || false;
        const http =
          link?.slug?.current?.startsWith('http://') ||
          link?.slug?.current?.startsWith('https://') ||
          link?.slug?.current?.startsWith('www');

        return (
          <article
            className=" flex  pl-4  items-baseline justify-between"
            key={link?.title + index}>
            <div className="font-montserrat w-full tracking-wide text-[1rem] gap-0 sm:text-[1.5rem] font-semibold ">
              <Link
                key={index}
                onClick={onLinkClickAction}
                href={http ? link?.slug.current : `/${link?.slug.current}`}
                target={http ? '_blank' : '_self'}>
                <p className="text-foreground transition ease-in-out duration-150 hover:text-mango py-1.5 md:py-3">
                  {link?.title}
                </p>
              </Link>
              {/* SUB-MENU */}
              {link?.subLinks && link?.subLinks?.length > 0 ? (
                <div
                  onClick={onLinkClickAction}
                  typeof="button"
                  className="grid transition-all duration-100 ease-in-out border-b-[1px] border-transparent [border-image:linear-gradient(to_right,transparent_0%,#88848A_20%,#88848A_80%,transparent_100%)_1]"
                  style={{
                    gridTemplateRows: isExpanded ? '1fr' : '0fr',
                  }}>
                  <div className="overflow-hidden">
                    {link?.subLinks.map((item: any, index: number) => (
                      <Link
                        key={index + item?.title}
                        href={`/${item?.slug.current}`}
                        className="block py-2 px-3 w-full transition-colors duration-100 hover:text-darkGold">
                        {item?.title}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            {link?.icon ? (
              <div className="w-5 h-5">
                <Image
                  src={urlFor(link?.icon).url()}
                  alt={link?.title}
                  width={10}
                  height={10}
                  className="w-full h-full object-cover opacity-60"
                />
              </div>
            ) : link?.subLinks && link?.subLinks?.length > 0 ? (
              <button
                className="cursor-pointer w-14 h-10 grid place-items-center"
                onClick={() => toggleExpand(index)}>
                <ChevronDown
                  size={20}
                  className=" transition ease-in-out duration-100"
                  style={{
                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                />
              </button>
            ) : null}
          </article>
        );
      })}
    </section>
  );
};

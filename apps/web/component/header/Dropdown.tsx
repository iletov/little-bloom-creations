'use client';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { PortableTextContainer } from '../portabletext-container/PortableTextContainer';
import { urlFor } from '@/sanity/lib/image';

type DropDownProps = {
  data: {
    label: string;
    href: string;
    items?: {
      label: string;
      href: string;
      desc?: any;
      image?: any;
    }[];
  };
  openDropdown: number | null;
  index: number;
};

const Dropdown = ({ data, openDropdown, index }: DropDownProps) => {
  return (
    <AnimatePresence>
      {data?.items && openDropdown === index && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full inset-x-0 pt-6 w-full z-50">
          <ul className="bg-white/95 backdrop-blur-xl border border-slate-200/60 rounded-2xl py-3 shadow-2xl block min-w-max">
            {data?.items &&
              data.items.length > 0 &&
              data.items.map((subItem, subIndex: number) => (
                <motion.li key={subIndex} className="px-2">
                  <Link
                    href={`/${data?.href}/${subItem?.href}`}
                    className="group px-4 py-3 flex items-start gap-4 justify-baseline hover:bg-slate-50/80 transition-all duration-300 rounded-xl cursor-pointer">
                    <div className="relative min-w-[4.5rem] h-auto aspect-square rounded-xl overflow-hidden border border-slate-100 bg-slate-50/50 shadow-sm flex items-center justify-center group-hover:scale-105 group-hover:shadow-md transition-all duration-300">
                      <Image
                        src={subItem?.image ? urlFor(subItem.image).width(200).height(200).fit('crop').url() : "/placeholder.svg"}
                        alt={subItem?.label || "Category Image"}
                        fill={true}
                        sizes="200px"
                        quality={100}
                        className={cn("object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-300", !subItem?.image && "p-2")}
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-slate-800 block text-[1.5rem] font-semibold capitalize group-hover:text-emerald-700 transition-colors duration-300">
                        {subItem?.label}
                      </p>
                      <PortableTextContainer
                        data={subItem?.desc}
                        className="text-[1.3rem] font-medium text-slate-500 leading-snug line-clamp-2"
                      />
                    </div>
                  </Link>
                  <div
                    className={cn(
                      'w-[90%] mx-auto h-[1px] bg-slate-100 my-2',
                      subIndex === (data?.items?.length ?? 0) - 1 && 'hidden',
                    )}
                  />
                </motion.li>
              ))}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Dropdown;

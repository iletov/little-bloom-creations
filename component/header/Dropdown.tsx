'use client';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { PortableTextContainer } from '../portabletext-container/PortableTextContainer';

type DropDownProps = {
  data: any;
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
          className="absolute top-full inset-x-0 pt-6 w-full z-50 ">
          <ul className=" bg-white rounded-[0.8rem] py-2 shadow-lg block min-w-max">
            {data?.items &&
              data.items.length > 0 &&
              data?.items.map((subItem: any, subIndex: number) => (
                <motion.li key={subIndex} className="px-2">
                  <Link
                    href={`/${data?.href}/${subItem?.href}`}
                    className="px-4 py-4 flex items-start gap-4 justify-baseline hover:bg-green-1/50 transition-colors rounded-[0.8rem]">
                    <div className="relative min-w-[4rem] h-auto aspect-square">
                      <Image
                        src="/placeholder.svg"
                        alt=""
                        fill={true}
                        // width={34}
                        // height={34}
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-green-dark block  text-[1.6rem] font-semibold capitalize">
                        {subItem?.label}
                      </p>
                      <PortableTextContainer
                        data={subItem?.desc}
                        className="text-[1.2rem] font-light leading-[1.2]"
                      />
                    </div>
                  </Link>
                  <div
                    className={cn(
                      'w-full h-[1px] bg-green-1 my-2 ',
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

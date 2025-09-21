'use client';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import React, { useState } from 'react';

type DropDownProps = {
  data: any;
  openDropdown: number | null;
  index: number;
};

const Dropdown = ({ data, openDropdown, index }: DropDownProps) => {
  const [hoveredSubItem, setHoveredSubItem] = useState<number | null>(null);
  const [openSubDropdown, setOpenSubDropdown] = useState<number | null>(null);

  return (
    <AnimatePresence>
      {data?.items && openDropdown === index && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full inset-x-0 pt-6 w-full z-50 ">
          <ul className=" space-y-2 bg-white rounded-[0.8rem] shadow-lg">
            {data?.items &&
              data.items.length > 0 &&
              data?.items.map((subItem: any, subIndex: number) => (
                <motion.li
                  key={subIndex}
                  onMouseEnter={() => setOpenSubDropdown(subIndex)}
                  onMouseLeave={() => setOpenSubDropdown(null)}>
                  <Link
                    href={`/${data?.href}/${subItem?.href}`}
                    className="block px-4 py-2 ">
                    <span className="text-green-dark block px-4 py-2  hover:bg-green-1 rounded-[0.8rem] transition-colors capitalize">
                      {subItem?.label}
                    </span>
                  </Link>
                  <div
                    className={cn(
                      'w-full h-[1px] bg-green-1 my-2',
                      subIndex === (data?.items?.length ?? 0) - 1 && 'hidden',
                    )}
                  />
                  <AnimatePresence>
                    {subItem?.items && openSubDropdown === subIndex && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-full top-3 z-50 min-w-max" // Position to the right
                      >
                        <ul className="p-3 space-y-2 ">
                          <div className="bg-white rounded-[0.8rem] shadow-lg border border-gray-200">
                            {subItem?.items?.map(
                              (subSubItem: any, subSubIndex: number) => (
                                <li key={subSubIndex + 'sub-sub-items'}>
                                  <Link
                                    href={`/${data?.href}/${subItem?.href}/${subSubItem?.href}`}
                                    className="block px-4 py-2 ">
                                    <span className="text-green-dark block px-4 py-2  hover:bg-green-1 rounded-[0.8rem] transition-colors capitalize">
                                      {subSubItem?.label}
                                    </span>
                                  </Link>
                                  <div
                                    className={cn(
                                      'w-full h-[1px] bg-green-1 my-2',
                                      subSubIndex ===
                                        (subItem?.items?.length ?? 0) - 1 &&
                                        'hidden',
                                    )}
                                  />
                                </li>
                              ),
                            )}
                          </div>
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.li>
              ))}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Dropdown;

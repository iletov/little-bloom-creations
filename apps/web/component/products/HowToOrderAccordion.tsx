'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PortableTextContainer } from '../portabletext-container/PortableTextContainer';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HowToOrderProps {
  guide: {
    title?: string;
    steps?: Array<{
      title?: string;
      content?: any;
    }>;
  };
}

export const HowToOrderAccordion = ({ guide }: HowToOrderProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // Open first by default

  if (!guide || !guide.steps || guide.steps.length === 0) return null;

  return (
    <div className="mt-12 mb-8 pt-10 border-t border-gray-100">
      <h3 className="text-[2.2rem] font-bold text-slate-800 mb-6">
        {guide.title || 'Как да поръчам'}
      </h3>
      
      <div className="flex flex-col">
        {guide.steps.map((step, index) => {
          const isOpen = openIndex === index;
          
          return (
            <div 
              key={index} 
              className="border-t border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex items-center justify-between py-5 text-left"
              >
                <span className="text-[1.5rem] font-medium text-slate-800 pr-4">
                  {step.title}
                </span>
                <ChevronDown 
                  className={cn(
                    "w-6 h-6 text-slate-500 transition-transform duration-300 shrink-0",
                    isOpen ? "rotate-180 text-green-dark" : "rotate-0"
                  )} 
                />
              </button>
              
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div className="pb-6 pt-0 text-slate-600 text-[1.4rem]">
                      <PortableTextContainer data={step.content} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};

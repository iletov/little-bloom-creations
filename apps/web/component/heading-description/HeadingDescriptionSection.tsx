'use client';

import { descriptionType, Title, ListItems } from '@/types';
import React, { useState, useEffect } from 'react';
import { PortableTextContainer } from '../portabletext-container/PortableTextContainer';
import FloralDivider from './FloralDivider';
import HighlightedHeading from './HighlightedHeading';
import { cn } from '@/lib/utils';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface HeadingDescriptionSectionProps {
  data: {
    heading: Title;
    eyebrow?: string;
    description: descriptionType;
    phrase?: string;
    listItems?: Array<ListItems>;
  };
}

const HeadingDescriptionSection = ({
  data,
}: HeadingDescriptionSectionProps): React.JSX.Element => {
  const hasSteps = data.listItems && data.listItems.length > 0;
  
  const [activeStep, setActiveStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!hasSteps) return;
    
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % (data.listItems?.length || 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [hasSteps, isPaused, data.listItems]);

  if (hasSteps && data.listItems) {
    return (
      <section className="pink-gradient border-y border-pink-5/40 py-12 sm:py-16 lg:py-12 xl:py-12 font-montserrat lg:min-h-[60vh] xl:min-h-[60vh] flex flex-col justify-center relative">
        <div className="section_wrapper">
          
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-8 xl:gap-20 items-center">
            {/* Left Column: Text and Steps */}
            <div className="space-y-6 lg:space-y-8 lg:pr-4 xl:pr-8">
              <div className="space-y-4">
                {data.eyebrow?.trim() ? (
                  <p className="font-montserrat text-[1.4rem] font-medium uppercase tracking-[0.28em] text-green-9 sm:text-[1.6rem]">
                    {data.eyebrow.trim()}
                  </p>
                ) : null}

                <HighlightedHeading
                  text={data.heading.title}
                  word={data.heading.highlightedWord}
                  color={data.heading.highlightedColor ?? 'var(--green-5)'}
                  className="text-[3.6rem] sm:text-[4.6rem] lg:text-[3.6rem] xl:text-[4.2rem] text-left leading-[1.1]"
                  tag="h2"
                />

                <PortableTextContainer
                  data={data.description}
                  className="text-[1.6rem] leading-[1.6] text-slate-600 sm:text-[1.8rem] lg:text-[1.5rem] xl:text-[1.6rem] text-left max-w-2xl"
                />
              </div>

              {/* Interactive Steps List */}
              <div 
                className="space-y-3 lg:space-y-2 xl:space-y-4 pt-4 xl:pt-6 h-[400px] sm:h-[450px] lg:h-[320px] xl:h-[380px]"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                {data.listItems.map((step, index) => {
                  const isActive = index === activeStep;
                  
                  return (
                    <div 
                      key={step._key || index}
                      onClick={() => setActiveStep(index)}
                      className={cn(
                        "group flex gap-6 cursor-pointer transition-all duration-300 rounded-3xl p-6 -ml-6 border border-transparent",
                        isActive ? "bg-white/60 shadow-sm border-white/80" : "hover:bg-white/30"
                      )}
                    >
                      {/* Step Indicator */}
                      <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-full font-bold text-[2rem] transition-colors duration-300"
                           style={{
                             backgroundColor: isActive ? 'var(--green-5)' : 'rgba(255, 255, 255, 0.5)',
                             color: isActive ? 'white' : 'var(--green-dark)'
                           }}
                      >
                        {index + 1}
                      </div>
                      
                      {/* Step Text */}
                      <div className="space-y-1 flex-1 mt-1">
                        <h3 className={cn(
                          "text-[1.8rem] sm:text-[2.2rem] lg:text-[1.7rem] xl:text-[1.9rem] font-semibold transition-colors duration-300",
                          isActive ? "text-green-dark" : "text-slate-600 group-hover:text-green-dark"
                        )}>
                          {step.title}
                        </h3>
                        <AnimatePresence>
                          {isActive && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="text-[1.4rem] sm:text-[1.6rem] lg:text-[1.3rem] xl:text-[1.4rem] leading-relaxed text-slate-600 overflow-hidden"
                            >
                              <div className="pt-2">
                                <PortableTextContainer data={step.description as any} />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Animated Image */}
            <div className="relative h-[400px] sm:h-[500px] lg:h-[400px] xl:h-[480px] w-full rounded-[2rem] overflow-hidden shadow-2xl bg-white/50 border border-white/50">
              <AnimatePresence mode="wait">
                {data.listItems[activeStep]?.image && (
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={urlFor(data.listItems[activeStep].image!).url()}
                      alt={data.listItems[activeStep].image?.alt || data.listItems[activeStep].title || 'Step image'}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
        </div>
      </section>
    );
  }

  // Fallback to the old layout if no steps are present
  return (
    <section className="pink-gradient border-y border-pink-5/40 py-14 sm:py-16 lg:py-20 font-montserrat">
      <div className="section_wrapper space-y-7 text-center lg:space-y-8">
        {data.eyebrow?.trim() ? (
          <p className="font-montserrat text-[1.2rem] font-medium uppercase tracking-[0.28em] text-green-9 sm:text-[1.4rem]">
            {data.eyebrow.trim()}
          </p>
        ) : null}

        <HighlightedHeading
          text={data.heading.title}
          word={data.heading.highlightedWord}
          color={data.heading.highlightedColor ?? 'var(--green-5)'}
          className="mx-auto max-w-[120rem] text-[3.2rem] sm:text-[4rem] lg:text-[4.8rem]"
          tag="h2"
        />

        <div className="grid place-items-center gap-5">
          <PortableTextContainer
            data={data.description}
            className="mx-auto max-w-[76rem] text-[1.5rem] leading-[1.6] text-slate-600 sm:text-[1.6rem]"
          />
          <div className="grid place-items-center gap-1">
            <FloralDivider />
            {data.phrase?.trim() ? (
              <p className="font-montserrat text-[1.5rem] tracking-[0.12em] text-green-dark sm:text-[1.7rem]">
                {data.phrase.trim()}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeadingDescriptionSection;

'use client';
import { cn } from '@/lib/utils';
import React, { useRef, useState } from 'react';
import { NavigationSubMenu } from './NavigationSubMenu';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { IconsCardsProps } from '../cards/IconsCards';
import { IconsCards } from '../banner/banner-bottom-curve/BannerBottomCurve';
import LiquidDrop from '../animations/LiquidDrop';
import GlowEffect from '../animations/GlowEffect';

interface Props {
  data: IconsCards | undefined;
  className?: string;
}

const SubHeadingMenu = ({ data, className }: Props) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const nav_ref = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring animations for smooth liquid movement
  const springX = useSpring(mouseX, { stiffness: 150, damping: 15 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 15 });

  const handleMouseMove = (event: React.MouseEvent, index: number) => {
    if (nav_ref.current && hoveredIndex === index) {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;

      mouseX.set(x * 0.3); // Scale down the movement
      mouseY.set(y * 0.3);
    }
  };

  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      className={cn(
        ' w-full max-w-[calc(100%-1rem)] md:w-fit md:max-w-[unset] flex justify-center gap-1 md:gap-2 p-2 md:p-2.5 absolute top-[0.5rem] z-10 left-[50%]  bg-lightPurple/40 backdrop-blur-sm rounded-full',
        className,
      )}
      initial={{ scaleX: 0, x: '-50%' }}
      animate={{ scaleX: 1, x: '-50%' }}
      style={{
        transformOrigin: 'center',
      }}
      transition={{
        delay: 1.3,
        duration: 0.15,
        ease: 'easeInOut',
      }}>
      <motion.nav
        ref={nav_ref}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: 1.6, // 0.5s initial delay + 0.6s grow animation
          duration: 0.4,
          ease: 'easeInOut',
        }}
        className="flex items-center gap-2">
        <ul className="flex justify-center flex-wrap md:gap-4">
          {data?.cards?.map((card: any, index: number) => (
            <motion.li
              key={card?._key + index}
              className="relative"
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseMove={e => handleMouseMove(e, index)}
              onMouseLeave={handleMouseLeave}>
              {/* Main liquid background */}
              {/* {hoveredIndex === index && (
                <motion.div
                  layoutId="liquidBackground"
                  className="absolute inset-0 rounded-full"
                  style={{
                    background:
                      'linear-gradient(135deg, #D4A017 0%, #D4A017 100%)',
                    x: springX,
                    y: springY,
                  }}
                  initial={{
                    opacity: 0,
                    scale: 0.8,
                    rotateZ: -10,
                    skewX: -5,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    rotateZ: 0,
                    skewX: 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.8,
                    rotateZ: 10,
                    skewX: 5,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 200,
                    damping: 12,
                    delay: 0.1,
                  }}
                />
              )} */}

              {/* Liquid stretch effect */}
              {/* {hoveredIndex === index && (
                <motion.div
                  className="absolute inset-0 rounded-full opacity-20"
                  style={{
                    background:
                      'linear-gradient(135deg, #D4A017 0%, #D4A017 100%)',
                    x: springX,
                    y: springY,
                  }}
                  initial={{
                    scale: 1,
                    scaleX: 1,
                    scaleY: 1,
                  }}
                  animate={{
                    scale: [1, 1.15, 1],
                    scaleX: [1, 1.3, 0.9, 1],
                    scaleY: [1, 0.8, 1.1, 1],
                    rotate: [0, 3, -2, 0],
                  }}
                  transition={{
                    duration: 0.8,
                    ease: 'easeInOut',
                    times: [0, 0.3, 0.7, 1],
                  }}
                />
              )} */}

              {/* Navigation link */}
              <motion.a
                href={`/${card.slug.current}`}
                className="relative z-10 block px-2 md:px-3  py-1.5 text-white/80 font-semibold rounded-full transition-all duration-300"
                whileHover={{
                  color: '#ffffff',
                  scale: 1.02,
                  textShadow: '0 0 8px rgba(255,255,255,0.5)',
                }}
                whileTap={{
                  scale: 0.95,
                }}
                animate={{
                  y: hoveredIndex === index ? -1 : 0,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 25,
                  delay: hoveredIndex === index ? 0.1 : 0,
                }}>
                <motion.span
                  animate={{
                    scale: hoveredIndex === index ? 1.05 : 1,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 20,
                  }}
                  className="text-[0.875rem] md:-text-[1rem] whitespace-nowrap">
                  {card.heading}
                </motion.span>
              </motion.a>

              {/* Expanding ripple effect */}
              {hoveredIndex === index && <LiquidDrop />}

              {/* Liquid drip effect */}
              {/* {hoveredIndex === index && (
                <motion.div
                  className="absolute inset-0 rounded-full opacity-10"
                  style={{
                    background:
                      'radial-gradient(circle, #667eea 0%, transparent 70%)',
                  }}
                  initial={{
                    scale: 0.5,
                    opacity: 0,
                  }}
                  animate={{
                    scale: [0.5, 2, 3],
                    opacity: [0, 0.3, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    ease: 'easeOut',
                    delay: 0.2,
                  }}
                />
              )} */}
            </motion.li>
          ))}
        </ul>
        {/* Ambient glow effect */}
        {hoveredIndex !== null && <GlowEffect />}
      </motion.nav>
    </motion.div>
  );
};

export default SubHeadingMenu;

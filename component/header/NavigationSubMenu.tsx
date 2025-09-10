import { RefObject, useState } from 'react';
import { useMotionValue, useSpring } from 'motion/react';
import { motion } from 'framer-motion';

export function NavigationSubMenu({
  data,
  index,
  ref,
}: {
  data: any | undefined;
  index: number;
  ref: RefObject<HTMLDivElement | null>;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring animations for smooth liquid movement
  const springX = useSpring(mouseX, { stiffness: 150, damping: 15 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 15 });

  const handleMouseMove = (event: React.MouseEvent, index: number) => {
    if (ref.current && hoveredIndex === index) {
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
    <ul className="flex bg-white/10 backdrop-blur-md rounded-full shadow-2xl p-3 space-x-2 border border-white/20">
      <motion.li
        className="relative"
        onMouseEnter={() => handleMouseEnter(index)}
        onMouseMove={e => handleMouseMove(e, index)}
        onMouseLeave={handleMouseLeave}>
        {/* Main liquid background */}
        {hoveredIndex === index && (
          <motion.div
            layoutId="liquidBackground"
            className="absolute inset-0 rounded-full"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
        )}

        {/* Liquid stretch effect */}
        {hoveredIndex === index && (
          <motion.div
            className="absolute inset-0 rounded-full opacity-20"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
        )}

        {/* Navigation link */}
        <motion.a
          href={data.slug.current}
          className="relative z-10 block px-8 py-4 text-white/80 font-semibold rounded-full transition-all duration-300"
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
            }}>
            {data.heading}
          </motion.span>
        </motion.a>

        {/* Expanding ripple effect */}
        {hoveredIndex === index && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-white/30"
            initial={{
              scale: 1,
              opacity: 0.8,
            }}
            animate={{
              scale: 1.8,
              opacity: 0,
            }}
            transition={{
              duration: 1.2,
              ease: 'easeOut',
            }}
          />
        )}

        {/* Liquid drip effect */}
        {hoveredIndex === index && (
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
        )}
      </motion.li>
    </ul>
  );
}

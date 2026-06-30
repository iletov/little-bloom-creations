'use client';
import { motion } from 'framer-motion';

interface SpinnerProps {
  size?: number;
  color?: string;
  thickness?: number;
  backgroundColor?: string;
  speed?: number;
  text?: string;
  textColor?: string;
}

export default function Spinner({
  size = 84,
  color = '#D4A017',
  thickness = 4,
  backgroundColor = '#2B0F33',
  speed = 1.25,
  // text = 'Зареждане...',
  // textColor = '#D4A017',
}: SpinnerProps) {
  // SVG settings
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  return (
    <div
      className="w-full h-full flex items-center justify-center rounded-lg p-6 "
      style={{ backgroundColor }}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90">
          <defs>
            <linearGradient id="spinnerGradient" gradientTransform="rotate(0)">
              <stop offset="0%" stopColor={color} stopOpacity="1" />
              <stop offset="35%" stopColor={color} stopOpacity="1" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>

          <motion.circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="url(#spinnerGradient)"
            strokeWidth={thickness}
            strokeDasharray={circumference}
            strokeDashoffset={circumference * 0.25}
            strokeLinecap="round"
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: speed,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              transformOrigin: 'center',
            }}
          />
        </svg>
      </div>

      {/* {text && (
        <div
          className="mt-3 text-center font-medium"
          style={{ color: textColor }}>
          {text}
        </div>
      )} */}
    </div>
  );
}

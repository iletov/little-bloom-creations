'use client';

import React, { Children } from 'react';
import './style.css';
import { cn } from '@/lib/utils';
// import { CheckboxProps } from './CheckboxContainer';

interface CheckboxProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  checked?: boolean;
  onChange?: () => void;
}

export default function CheckboxButton({
  id,
  children,
  className,
  checked,
  onChange,
}: CheckboxProps) {
  return (
    <div className={cn(`relative flex items-left`, className)}>
      <label
        htmlFor={id}
        className={`custom-checkbox__btn w-full leading-none peer-disabled:cursor-not-allowed rounded-md peer-disabled:opacity-70 ${checked ? 'shadow-xl bg-[#2B0F33]/80' : ''}`}>
        <input type="checkbox" id={id} checked={checked} onChange={onChange} />
        <span className="checkbox-label__btn text-[1rem] font-montserrat h-[2.5rem] w-[5rem]">
          {children}
          <div className="blur-layer"></div>
        </span>
      </label>
    </div>
  );
}

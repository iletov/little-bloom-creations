'use client';

import React, { Children } from 'react';
import './style.css';

export interface CheckboxProps {
  id: string;
  children: React.ReactNode;
  styles?: string;
  checked?: boolean;
  onChange?: () => void;
}

export default function CheckboxContainer({
  id,
  children,
  styles,
  checked,
  onChange,
}: CheckboxProps) {
  return (
    <div className={`${styles} flex items-left gap-2 py-2`}>
      <label
        htmlFor={id}
        className="custom-checkbox  w-full font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        <input type="checkbox" id={id} checked={checked} onChange={onChange} />
        <span className="checkbox-label text-[16px]">{children}</span>
      </label>
    </div>
  );
}

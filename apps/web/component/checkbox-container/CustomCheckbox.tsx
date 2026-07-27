import React from 'react';
import { Check } from 'lucide-react';

const CustomCheckbox = () => {
  return (
    <span className="bg-green-0 peer-checked:border-green-9 border w-8 h-8 flex items-center justify-center peer-checked:[&>span]:opacity-100 peer-checked:[&>span]:scale-100">
      <span className="opacity-0 scale-0 text-green-9 transition-all duration-200">
        <Check size={20} strokeWidth={3} />
      </span>
    </span>
  );
};

export default CustomCheckbox;

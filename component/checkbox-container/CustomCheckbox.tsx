import React from 'react';

const CustomCheckbox = () => {
  return (
    <span className="bg-green-0 peer-checked:border-green-9 border  w-10 h-10 flex items-center justify-center peer-checked:[&>span]:opacity-100 peer-checked:[&>span]:scale-100">
      <span className="opacity-0 scale-0 text-green-9 text-[2rem] transition-all duration-200">
        &#x1F5F8;
      </span>
    </span>
  );
};

export default CustomCheckbox;

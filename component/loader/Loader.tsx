import React from 'react';

export const Loader = () => {
  return (
    <div
      className="inline-block h-8 w-8 animate-spin rounded-full border-[2px] border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] border-green-dark"
      role="status"></div>
  );
};

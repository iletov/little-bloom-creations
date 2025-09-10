import React from 'react';

const Skeleton = () => {
  return (
    <div className="grid-container">
      {[...Array(12)].map((_, index) => (
        <div
          className="relative min-h-[10rem] py-1 rounded-[1rem] overflow-hidden bg-gray-200 animate-pulse"
          key={index + 'skeleton'}
        />
      ))}
    </div>
  );
};

export default Skeleton;

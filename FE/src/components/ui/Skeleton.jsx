import React from 'react';

// Komponen Bata Universal
const Skeleton = ({ className = '' }) => {
  return <div className={`bg-gray-200 animate-pulse ${className}`}></div>;
};

export default Skeleton;

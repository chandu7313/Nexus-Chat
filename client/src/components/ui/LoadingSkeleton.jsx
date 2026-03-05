import React from 'react';

const LoadingSkeleton = ({ type = 'message', count = 1 }) => {
  if (type === 'message') {
    return (
      <div className="flex flex-col gap-4 p-3">
        {[...Array(count)].map((_, i) => (
          <div key={i} className={`flex gap-3 ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
            <div className="skeleton h-8 w-8 rounded-full" />
            <div className="flex flex-col gap-2">
              <div className="skeleton h-4 w-32 rounded-lg" />
              <div className="skeleton h-4 w-48 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (type === 'user') {
    return (
      <div className="flex flex-col gap-3 p-4">
        {[...Array(count)].map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="skeleton h-12 w-12 rounded-full" />
            <div className="flex-1 flex flex-col gap-2">
              <div className="skeleton h-4 w-24 rounded" />
              <div className="skeleton h-3 w-16 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  return null;
};

export default LoadingSkeleton;

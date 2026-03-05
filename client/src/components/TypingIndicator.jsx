import React from 'react';

const TypingIndicator = ({ userName = 'User' }) => {
  return (
    <div className="flex items-center gap-2 px-4 py-2 animate-fadeIn">
      <div className="flex gap-1">
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
      <span className="text-sm text-text-secondary">
        {userName} is typing...
      </span>
    </div>
  );
};

export default TypingIndicator;

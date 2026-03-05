import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Tooltip = ({ 
  children, 
  content, 
  position = 'top', 
  delay = 200 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  let timeout;
  
  const showTooltip = () => {
    timeout = setTimeout(() => setIsVisible(true), delay);
  };
  
  const hideTooltip = () => {
    clearTimeout(timeout);
    setIsVisible(false);
  };
  
  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };
  
  return (
    <div 
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      
      <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className={`absolute ${positions[position]} z-50 whitespace-nowrap px-3 py-1.5 rounded-lg text-sm pointer-events-none bg-slate-800 text-white shadow-md border border-slate-700`}
          >
            {content}
            
            {/* Arrow */}
            <div 
              className={`absolute w-2 h-2 rotate-45 bg-slate-800 border-slate-700 ${
                position === 'top' ? 'bottom-[-5px] left-1/2 -translate-x-1/2 border-b border-r' :
                position === 'bottom' ? 'top-[-5px] left-1/2 -translate-x-1/2 border-t border-l' :
                position === 'left' ? 'right-[-5px] top-1/2 -translate-y-1/2 border-t border-r' :
                'left-[-5px] top-1/2 -translate-y-1/2 border-b border-l'
              }`}
            />
          </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;

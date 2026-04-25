
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface InfoTooltipProps {
  content: string;
  title?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({ content, title, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (isVisible && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      let top = rect.top + scrollY;
      let left = rect.left + scrollX;
      
      const tooltipWidth = 280;
      const tooltipHeight = 150;
      
      if (position === 'bottom') {
        top = rect.bottom + scrollY + 10;
        left = rect.left + rect.width / 2 + scrollX;
      } else if (position === 'top') {
        top = rect.top + scrollY - 10;
        left = rect.left + rect.width / 2 + scrollX;
      } else if (position === 'left') {
        top = rect.top + rect.height / 2 + scrollY;
        left = rect.left + scrollX - 10;
      } else if (position === 'right') {
        top = rect.top + rect.height / 2 + scrollY;
        left = rect.right + scrollX + 10;
      }

      // Boundary checks
      const padding = 10;
      if (left - tooltipWidth / 2 < scrollX + padding) {
        left = scrollX + tooltipWidth / 2 + padding;
      } else if (left + tooltipWidth / 2 > scrollX + viewportWidth - padding) {
        left = scrollX + viewportWidth - tooltipWidth / 2 - padding;
      }

      if (top - tooltipHeight < scrollY + padding && position === 'top') {
        top = scrollY + tooltipHeight + padding;
      }

      setCoords({ top, left });
    }
  }, [isVisible, position]);

  const getPositionStyles = () => {
    switch (position) {
      case 'bottom': 
        return { transform: 'translateX(-50%)' };
      case 'left': 
        return { transform: 'translate(-100%, -50%)' };
      case 'right': 
        return { transform: 'translate(0, -50%)' };
      default: 
        return { transform: 'translate(-50%, -100%)' };
    }
  };

  const getArrowClasses = () => {
    switch (position) {
      case 'bottom': return 'bottom-full left-1/2 -translate-x-1/2 border-8 border-transparent border-b-surface-dim';
      case 'left': return 'left-full top-1/2 -translate-y-1/2 border-8 border-transparent border-l-surface-dim';
      case 'right': return 'right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-surface-dim';
      default: return 'top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-surface-dim';
    }
  };

  return (
    <span ref={triggerRef} className="relative inline-block ml-1 align-middle">
      <button
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="text-on-surface-variant/40 hover:text-primary-cyan transition-colors"
      >
        <HelpCircle size={12} />
      </button>
      
      <AnimatePresence>
        {isVisible && createPortal(
          <motion.span
            initial={{ opacity: 0, scale: 0.95, y: position === 'bottom' ? -10 : 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{
              position: 'absolute',
              top: coords.top,
              left: coords.left,
              ...getPositionStyles(),
              zIndex: 9999,
            }}
            className="w-[280px] p-4 bg-surface-dim border border-primary-cyan/30 shadow-[0_20px_50px_rgba(0,0,0,0.9)] rounded-xl pointer-events-none block backdrop-blur-2xl"
          >
            {title && (
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-cyan mb-2 border-b border-white/10 pb-2 block">
                {title}
              </span>
            )}
            <span className="text-[11px] text-white/90 leading-relaxed font-medium block">
              {content}
            </span>
            <span className={`absolute ${getArrowClasses()}`} />
          </motion.span>,
          document.body
        )}
      </AnimatePresence>
    </span>
  );
};


import React from 'react';
import { motion } from 'motion/react';

interface LogoProps {
  size?: number;
  className?: string;
  color?: 'cyan' | 'rose' | 'gold' | 'blue' | 'violet' | 'white' | 'multi';
  isAnimated?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 40, className = "", color = 'multi', isAnimated = true }) => {
  return (
    <div 
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg 
        viewBox="0 0 100 100" 
        className="absolute inset-0 w-full h-full"
      >
        {/* Outer Circle - Blue */}
        <motion.circle
          cx="50"
          cy="50"
          r="42"
          stroke={color === 'multi' ? '#00E0FF' : 'currentColor'}
          strokeWidth="2"
          fill="none"
          strokeDasharray="210 54"
          strokeLinecap="round"
          animate={isAnimated ? { rotate: 360 } : {}}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className={color !== 'multi' ? 'text-blue-500' : 'drop-shadow-[0_0_25px_rgba(0,224,255,0.6)]'}
        />
        
        {/* Middle Circle - Rose */}
        <motion.circle
          cx="50"
          cy="50"
          r="28"
          stroke={color === 'multi' ? '#FF007A' : 'currentColor'}
          strokeWidth="2"
          fill="none"
          strokeDasharray="130 46"
          strokeLinecap="round"
          animate={isAnimated ? { rotate: -360 } : {}}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className={color !== 'multi' ? 'text-rose-500' : 'drop-shadow-[0_0_25px_rgba(255,0,122,0.6)]'}
        />
 
        {/* Inner Circle - Violet */}
        <motion.circle
          cx="50"
          cy="50"
          r="14"
          stroke={color === 'multi' ? '#8B5CF6' : 'currentColor'}
          strokeWidth="2"
          fill="none"
          strokeDasharray="60 28"
          strokeLinecap="round"
          animate={isAnimated ? { rotate: 360 } : {}}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className={color !== 'multi' ? 'text-violet-500' : 'drop-shadow-[0_0_25px_rgba(139,92,246,0.6)]'}
        />

        {/* Center Dot - White */}
        <circle
          cx="50"
          cy="50"
          r="2.5"
          fill="white"
          className="drop-shadow-[0_0_4px_rgba(255,255,255,0.6)]"
        />
      </svg>
      
      {/* BETA Badge */}
      <div className="absolute -bottom-1 -right-2 bg-accent-gold text-surface-dim text-[8px] font-black px-1 rounded-sm shadow-[0_0_10px_rgba(238,192,94,0.5)] z-10">
        BETA
      </div>
    </div>
  );
};


import React from 'react';
import { motion } from 'motion/react';
import { Contract } from '../../types';
import { useTranslation } from '../../context/LanguageContext';

interface TickerProps {
  contracts: Contract[];
}

export const Ticker: React.FC<TickerProps> = ({ contracts }) => {
  const { t } = useTranslation();
  
  // Duplicate contracts to ensure smooth infinite scroll
  const tickerItems = [...contracts, ...contracts, ...contracts];

  const handleTickerClick = (contract: Contract) => {
    // We can't directly call onSelectContract here as it's not passed in props
    // But we can use a custom event or just notify
    const event = new CustomEvent('ticker-contract-select', { detail: contract });
    window.dispatchEvent(event);
  };

  return (
    <div className="w-full bg-surface-dim/80 backdrop-blur-md border-y border-white/5 h-10 flex items-center overflow-hidden relative group z-40">
      <motion.div 
        animate={{ x: [0, -2500] }}
        transition={{ duration: 300, repeat: Infinity, ease: "linear" }}
        className="flex whitespace-nowrap gap-12 items-center h-full"
      >
        {tickerItems.map((contract, i) => {
          const currentUnitPrice = 50 * (1 + contract.growth / 100);
          return (
            <div 
              key={i} 
              className="flex items-center gap-4 group/item cursor-pointer h-full"
              onClick={() => handleTickerClick(contract)}
            >
              <div className="flex items-center gap-2 h-full">
                <span className="text-[8px] font-mono text-primary-cyan px-1 py-0 bg-primary-cyan/10 border border-primary-cyan/20 rounded-sm flex items-center">
                  NEW_INDEX
                </span>
                <span className="text-[9px] font-mono text-on-surface-variant opacity-60 group-hover/item:opacity-100 transition-opacity flex items-center">
                  [{contract.registryIndex}]
                </span>
              </div>
              <span className="text-[10px] font-headline font-bold uppercase tracking-[0.15em] text-on-surface group-hover/item:text-primary-cyan transition-colors flex items-center h-full">
                {contract.name}
              </span>
              <div className="flex items-center gap-2 h-full">
                <span className="text-[10px] font-mono text-accent-gold flex items-center h-full">${currentUnitPrice.toFixed(2)}</span>
                <span className={`text-[9px] font-mono font-bold flex items-center h-full ${contract.growth >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {contract.growth >= 0 ? '▲' : '▼'} {Math.abs(contract.growth)}%
                </span>
              </div>
              <div className="w-1 h-1 bg-white/10 rounded-full mx-2 self-center" />
            </div>
          );
        })}
      </motion.div>
      
      {/* Gradient Fades */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-surface-dim to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-surface-dim to-transparent z-10 pointer-events-none" />
    </div>
  );
};

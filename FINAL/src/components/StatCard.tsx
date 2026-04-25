import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { InfoTooltip } from './InfoTooltip';
import { NumberTicker } from './ui/NumberTicker';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendDown?: boolean;
  color?: 'cyan' | 'gold' | 'emerald' | 'blue' | 'purple';
  subValue?: string;
  tooltip?: string;
  isCurrency?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendDown, 
  color = 'cyan',
  subValue,
  tooltip,
  isCurrency = true
}) => {
  const colorClasses = {
    cyan: 'from-primary-cyan/20 to-primary-cyan/5 text-primary-cyan border-primary-cyan/20 shadow-[0_0_20px_rgba(0,224,255,0.15)]',
    gold: 'from-accent-gold/20 to-accent-gold/5 text-accent-gold border-accent-gold/20 shadow-[0_0_20px_rgba(255,191,0,0.15)]',
    emerald: 'from-emerald-400/20 to-emerald-400/5 text-emerald-400 border-emerald-400/20 shadow-[0_0_20px_rgba(52,211,153,0.15)]',
    blue: 'from-blue-400/20 to-blue-400/5 text-blue-400 border-blue-400/20 shadow-[0_0_20px_rgba(96,165,250,0.15)]',
    purple: 'from-purple-400/20 to-purple-400/5 text-purple-400 border-purple-400/20 shadow-[0_0_20px_rgba(167,139,250,0.15)]',
  };

  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.02 }}
      className={`relative overflow-hidden bg-gradient-to-br ${colorClasses[color]} backdrop-blur-2xl border p-4 md:p-5 lg:p-8 rounded-2xl group transition-all duration-700 shadow-2xl min-h-[120px] md:min-h-[140px] lg:min-h-[160px] flex flex-col justify-center`}
    >
      <div className="absolute top-0 right-0 w-24 h-24 lg:w-32 lg:h-32 bg-white/5 rounded-full -mr-12 -mt-12 lg:-mr-16 lg:-mt-16 blur-2xl lg:blur-3xl group-hover:bg-white/10 transition-all duration-700" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2 lg:mb-4">
          <div className={`p-1.5 lg:p-3 rounded-lg bg-white/5 border border-white/10 shadow-inner group-hover:scale-110 transition-transform duration-500`}>
            {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 14, className: 'lg:w-5 lg:h-5' }) : icon}
          </div>
          {trend && (
            <div className={`flex items-center gap-1 text-[7px] lg:text-[10px] font-black uppercase tracking-widest ${trendDown ? 'text-red-400' : 'text-emerald-400'} bg-white/5 px-1.5 py-0.5 rounded-full border border-white/5`}>
              {trendDown ? <TrendingDown size={7} className="lg:w-2.5 lg:h-2.5" /> : <TrendingUp size={7} className="lg:w-2.5 lg:h-2.5" />}
              {trend}
            </div>
          )}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-0.5 lg:mb-1">
            <p className="text-[7px] lg:text-[10px] text-on-surface-variant uppercase tracking-[0.2em] lg:tracking-[0.3em] font-black opacity-50">{title}</p>
            {tooltip && <InfoTooltip content={tooltip} title={title} position="top" />}
          </div>
          <h3 className="text-lg md:text-xl lg:text-3xl font-black font-headline text-on-surface tracking-tighter truncate">
            {typeof value === 'number' ? (
              <NumberTicker value={value} prefix={isCurrency ? "$" : ""} decimals={value % 1 === 0 ? 0 : 2} />
            ) : value}
          </h3>
          {subValue && (
            <p className="text-[7px] lg:text-[9px] text-on-surface-variant mt-1 lg:mt-2 font-bold uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">{subValue}</p>
          )}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
};

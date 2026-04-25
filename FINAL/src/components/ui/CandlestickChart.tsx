
import React from 'react';
import { motion } from 'motion/react';

interface CandlestickData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface CandlestickChartProps {
  data: CandlestickData[];
  height?: number;
}

export const CandlestickChart: React.FC<CandlestickChartProps> = ({ data, height = 300 }) => {
  if (!data || data.length === 0) return null;

  const maxPrice = Math.max(...data.map(d => d.high));
  const minPrice = Math.min(...data.map(d => d.low));
  const range = maxPrice - minPrice;
  const padding = range * 0.1;

  const yScale = (price: number) => {
    return height - ((price - (minPrice - padding)) / (range + padding * 2)) * height;
  };

  const width = 100 / data.length;

  return (
    <div className="w-full relative" style={{ height }}>
      <svg width="100%" height="100%" preserveAspectRatio="none">
        {/* Grid Lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
          <line 
            key={i}
            x1="0" 
            y1={height * p} 
            x2="100%" 
            y2={height * p} 
            stroke="rgba(255,255,255,0.03)" 
            strokeWidth="1" 
          />
        ))}

        {data.map((d, i) => {
          const isUp = d.close >= d.open;
          const color = isUp ? '#34D399' : '#F87171';
          const x = (i / data.length) * 100;
          const candleWidth = (100 / data.length) * 0.7;

          return (
            <g key={i}>
              {/* Wick */}
              <line 
                x1={`${x + width / 2}%`} 
                y1={yScale(d.high)} 
                x2={`${x + width / 2}%`} 
                y2={yScale(d.low)} 
                stroke={color} 
                strokeWidth="1" 
              />
              {/* Body */}
              <motion.rect 
                initial={{ height: 0, y: yScale(isUp ? d.open : d.close) }}
                animate={{ 
                  height: Math.max(1, Math.abs(yScale(d.close) - yScale(d.open))),
                  y: yScale(isUp ? d.close : d.open)
                }}
                x={`${x + (width - candleWidth) / 2}%`}
                width={`${candleWidth}%`}
                fill={color}
                opacity={0.8}
                rx="1"
              />
            </g>
          );
        })}
      </svg>
      
      {/* Price Labels */}
      <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-between text-[8px] font-mono text-on-surface-variant/40 pointer-events-none pr-2">
        <span>${maxPrice.toFixed(2)}</span>
        <span>${((maxPrice + minPrice) / 2).toFixed(2)}</span>
        <span>${minPrice.toFixed(2)}</span>
      </div>
    </div>
  );
};


import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, ShieldCheck, ArrowUpRight, ArrowDownLeft, Info, CheckCircle2, Clock, Calendar, ChevronDown, ChevronUp, Sparkles, Loader2, HelpCircle, Star, Scale, Zap, TrendingUp, TrendingDown } from 'lucide-react';
import { Contract, LYA_UNIT_VALUE } from '../types';
import { generateAssetAnalysis } from '../services/geminiService';
import { InfoTooltip } from './InfoTooltip';
import { useTranslation } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';

interface ContractCardProps {
  contract: Contract;
  onClick: () => void;
  onTrade: (contract: Contract, type: 'BUY' | 'SELL') => void;
  isWatchlisted?: boolean;
  onToggleWatchlist?: (e: React.MouseEvent, contractId: string) => void;
  comparisonList?: string[];
  onToggleComparison?: (id: string) => void;
  onNotify?: (msg: string) => void;
}

export const ContractCard: React.FC<ContractCardProps> = ({ 
  contract, 
  onClick, 
  onTrade,
  isWatchlisted = false,
  onToggleWatchlist,
  comparisonList = [],
  onToggleComparison,
  onNotify
}) => {
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Film': return 'bg-red-500/10 border-red-500/30 text-red-500';
      case 'TV Series': return 'bg-blue-500/10 border-blue-500/30 text-blue-500';
      case 'Music': return 'bg-pink-500/10 border-pink-500/30 text-pink-500';
      case 'Digital Art': return 'bg-primary-cyan/10 border-primary-cyan/30 text-primary-cyan';
      case 'Fine Art': return 'bg-accent-gold/10 border-accent-gold/30 text-accent-gold';
      case 'Gaming': return 'bg-green-500/10 border-green-500/30 text-green-500';
      case 'Literature': return 'bg-amber-500/10 border-amber-500/30 text-amber-500';
      default: return 'bg-white/10 border-white/30 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Development': return 'bg-white/5 border-white/10 text-on-surface-variant';
      case 'Production': return 'bg-accent-gold/10 border-accent-gold/30 text-accent-gold';
      case 'Post-Production': return 'bg-blue-500/10 border-blue-500/30 text-blue-500';
      case 'Completed': return 'bg-accent-green/10 border-accent-green/30 text-accent-green';
      case 'Released': return 'bg-primary-cyan/10 border-primary-cyan/30 text-primary-cyan';
      default: return 'bg-white/5 border-white/10 text-on-surface-variant';
    }
  };

  return (
    <div 
      className="bg-gradient-to-br from-surface-low/40 via-surface-low/30 to-primary-cyan/5 backdrop-blur-2xl border border-white/10 overflow-hidden group cursor-pointer relative hover:border-primary-cyan/50 transition-all duration-700 flex flex-col h-full rounded-2xl hover:shadow-[0_0_50px_rgba(0,224,255,0.2)] transform-gpu"
      onClick={onClick}
    >
      {/* Image Section - More Immersive */}
      <div className="relative h-72 overflow-hidden">
        <img 
          src={contract.image} 
          alt={contract.name} 
          className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110 opacity-70 group-hover:opacity-100"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-dim via-surface-dim/20 to-transparent opacity-80" />
        
        {/* Action Buttons - Top Right */}
        <div className="absolute top-6 right-6 z-10 flex flex-col gap-3 items-end">
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleComparison?.(contract.id);
              }}
              className={`p-2 backdrop-blur-md border rounded-full transition-all duration-300 group/compare ${
                comparisonList.includes(contract.id)
                  ? 'bg-primary-cyan border-primary-cyan text-surface-dim shadow-[0_0_15px_rgba(0,224,255,0.4)]'
                  : 'bg-surface-dim/60 border-white/10 text-on-surface-variant hover:bg-primary-cyan hover:text-surface-dim'
              }`}
              title={t('Compare', 'Comparer')}
            >
              <Scale size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleWatchlist?.(e, contract.id);
              }}
              className="p-2 bg-surface-dim/60 backdrop-blur-md border border-white/10 rounded-full hover:bg-primary-cyan hover:text-surface-dim transition-all duration-300 group/star"
            >
              <Star 
                size={16} 
                className={`${isWatchlisted ? 'fill-primary-cyan text-primary-cyan group-hover/star:fill-surface-dim group-hover/star:text-surface-dim' : 'text-on-surface-variant'}`} 
              />
            </button>
          </div>

          <div className="bg-black/60 backdrop-blur-xl border border-primary-cyan/30 p-2 md:p-3 rounded-xl flex flex-col items-center justify-center min-w-[70px] shadow-2xl">
            <div className="text-[7px] md:text-[8px] font-black text-primary-cyan uppercase tracking-widest mb-1">{t('LYA SCORE', 'SCORE LYA')}</div>
            <div className="flex items-baseline gap-0.5">
              <span className="text-xl md:text-2xl font-black italic text-white tracking-tighter leading-none">{contract.totalScore}</span>
              <span className="text-[8px] text-on-surface-variant opacity-40 font-bold">/1k</span>
            </div>
          </div>
        </div>

        {/* Subtle Badges */}
        <div className="absolute top-6 left-6 flex flex-col gap-2">
          <div className={`px-3 py-1 text-[9px] font-bold uppercase tracking-[0.25em] border backdrop-blur-xl w-fit ${
            contract.rarity === 'Legendary' ? 'bg-accent-gold/10 border-accent-gold/30 text-accent-gold' :
            contract.rarity === 'Epic' ? 'bg-purple-500/10 border-purple-500/30 text-purple-500' :
            'bg-primary-cyan/10 border-primary-cyan/30 text-primary-cyan'
          }`}>
            {contract.rarity}
          </div>
          <div className="flex gap-2">
            <div className={`px-3 py-1 text-[8px] font-bold uppercase tracking-[0.2em] border backdrop-blur-xl ${getCategoryColor(contract.category)}`}>
              {contract.category}
            </div>
            <div className={`px-3 py-1 text-[8px] font-bold uppercase tracking-[0.2em] border backdrop-blur-xl ${getStatusColor(contract.assetStatus)}`}>
              {contract.assetStatus}
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-8 right-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
              <div className="h-[1px] w-6 bg-primary-cyan"></div>
              <span className="text-[9px] font-mono text-primary-cyan uppercase tracking-[0.4em] font-medium">{contract.registryIndex}</span>
            </div>
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black font-mono ${contract.growth >= 0 ? 'bg-emerald-400/10 text-emerald-400' : 'bg-red-400/10 text-red-400'} border border-white/5 backdrop-blur-md`}>
              {contract.growth >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              {contract.growth >= 0 ? '+' : ''}{contract.growth}%
            </div>
          </div>
          <h3 className="text-3xl font-light font-headline text-on-surface group-hover:text-primary-cyan transition-colors leading-none uppercase tracking-tighter truncate mb-2">{contract.name}</h3>
          <p className="text-[11px] text-on-surface-variant uppercase tracking-[0.2em] truncate opacity-50 font-serif italic">{t('Issued by', 'Émis par')} {contract.issuerId}</p>
        </div>
      </div>

      <div className="p-8 space-y-8 flex-1 flex-col">
        {/* Project Value & Unit Price */}
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-1">
            <p className="text-[9px] text-on-surface-variant uppercase tracking-[0.3em] font-bold opacity-40">
              {t('Project Value', 'Valeur du Projet')}
            </p>
            <div className="text-xl font-medium font-headline text-accent-gold tracking-tighter">
              {formatPrice(contract.totalValue || 0)}
            </div>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-[9px] text-on-surface-variant uppercase tracking-[0.3em] font-bold opacity-40">
              {t('Unit Price', 'Prix Unitaire')}
            </p>
            <div className="text-xl font-medium font-headline text-white tracking-tighter">
              {formatPrice(contract.unitValue)}
            </div>
          </div>
        </div>

        {/* Available Stock - New Section */}
        <div className="pt-8 border-t border-white/5 space-y-3">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <p className="text-[9px] text-on-surface-variant uppercase tracking-[0.3em] font-bold opacity-40">
                {t('Available Stock', 'Stock Disponible')}
              </p>
              <div className="text-lg font-medium font-headline text-primary-cyan tracking-tighter">
                {contract.availableUnits?.toLocaleString() || '0'} 
                <span className="text-[9px] font-mono text-on-surface-variant ml-2 opacity-40 uppercase tracking-widest">Units</span>
                <span className="text-[10px] text-accent-gold ml-2 font-bold">({formatPrice((contract.availableUnits || 0) * contract.unitValue)})</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-mono text-on-surface-variant opacity-40 uppercase tracking-widest">
                {(( (contract.availableUnits || 0) / contract.totalUnits) * 100).toFixed(1)}% {t('Remaining', 'Restant')}
              </p>
            </div>
          </div>
          <div className="h-[2px] bg-white/5 relative overflow-hidden rounded-full">
            <motion.div 
              animate={{ width: `${((contract.availableUnits || 0) / contract.totalUnits) * 100}%` }}
              className="absolute h-full bg-primary-cyan shadow-[0_0_10px_rgba(0,224,255,0.5)]"
            />
          </div>
        </div>

        {/* Revenue Share & Validator */}
        <div className="pt-8 border-t border-white/5 grid grid-cols-2 gap-8">
          <div className="space-y-1">
            <p className="text-[9px] text-on-surface-variant uppercase tracking-[0.3em] font-bold opacity-40">
              {t('Revenue Share', 'Part des Revenus')}
            </p>
            <div className="text-xl font-medium font-headline text-primary-cyan tracking-tighter flex items-center gap-2">
              <Zap size={14} className="text-primary-cyan opacity-60" />
              {contract.revenueSharePercentage}%
            </div>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-[9px] text-on-surface-variant uppercase tracking-[0.3em] font-bold opacity-40">
              {t('Validator', 'Validateur')}
            </p>
            <div className="text-[10px] font-black uppercase tracking-widest text-white truncate flex items-center justify-end gap-2">
              <span className="truncate max-w-[120px]">{contract.professionalValidator || t('LYA Node', 'Nœud LYA')}</span>
              <ShieldCheck size={12} className="text-accent-green" />
            </div>
          </div>
        </div>

        {/* Score Section - Enhanced Visibility */}
        <div className="pt-8 border-t border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-[9px] uppercase tracking-[0.3em] text-on-surface-variant font-black">
                {t('LYA Quality Index', 'Indice de Qualité LYA')}
              </span>
              <InfoTooltip 
                position="top"
                title={t('LYA Score', 'Score LYA')}
                content={t('A composite score representing project quality across 5 institutional pillars.', 'Un score composite représentant la qualité du projet à travers 5 piliers institutionnels.')}
              />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black font-headline text-primary-cyan">{contract.totalScore}</span>
              <span className="text-[10px] text-on-surface-variant opacity-30">/1000</span>
            </div>
          </div>
          
          <div className="flex gap-[3px] h-[4px]">
            {contract.pillars.map((p, i) => (
              <div 
                key={i} 
                className="flex-1 bg-white/5 relative overflow-hidden rounded-full"
              >
                <motion.div 
                  animate={{ width: `${(p.score / 200) * 100}%` }}
                  className={`h-full shadow-[0_0_10px_rgba(255,255,255,0.1)] ${
                    i === 0 ? 'bg-primary-cyan shadow-primary-cyan/20' : 
                    i === 1 ? 'bg-accent-pink shadow-accent-pink/20' : 
                    i === 2 ? 'bg-accent-green shadow-accent-green/20' : 
                    i === 3 ? 'bg-accent-purple shadow-accent-purple/20' : 
                    'bg-accent-gold shadow-accent-gold/20'
                  }`}
                />
              </div>
            ))}
          </div>

          {/* Explicit Pillar Scores Breakdown - Always Visible */}
          <div className="grid grid-cols-5 gap-1 pt-2">
            {contract.pillars.map((p, i) => (
              <div key={i} className="text-center space-y-1">
                <div className={`text-[11px] font-black uppercase tracking-tighter ${
                  i === 0 ? 'text-primary-cyan' : 
                  i === 1 ? 'text-accent-pink' : 
                  i === 2 ? 'text-accent-green' : 
                  i === 3 ? 'text-accent-purple' : 
                  'text-accent-gold'
                }`}>
                  {p.score}
                </div>
                <div className="text-[8px] text-white uppercase tracking-widest font-bold opacity-80 truncate px-0.5">
                  {p.label.split(' ')[0]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons - Enhanced with Info */}
        <div className="mt-auto pt-8 space-y-4">
          <div className="flex gap-3">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onTrade(contract, 'BUY');
              }}
              className="flex-1 bg-primary-cyan text-surface-dim py-4 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-white transition-all active:scale-95 flex items-center justify-center gap-3 rounded-xl shadow-[0_10px_30px_rgba(0,224,255,0.2)]"
            >
              <ArrowDownLeft size={14} />
              {t('Acquire', 'Acquérir')}
            </button>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onTrade(contract, 'SELL');
              }}
              className="flex-1 border border-white/10 text-on-surface-variant py-4 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-white/5 hover:text-on-surface transition-all active:scale-95 flex items-center justify-center gap-3 rounded-xl"
            >
              <ArrowUpRight size={14} />
              {t('Transfer', 'Transférer')}
            </button>
          </div>
          <p className="text-[8px] text-on-surface-variant uppercase tracking-widest text-center opacity-30 font-bold">
            {t('Peer-to-Peer Settlement via LYA Protocol', 'Règlement de pair à pair via le protocole LYA')}
          </p>
        </div>
      </div>
    </div>
  );
};


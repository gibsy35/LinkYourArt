
import React from 'react';
import { motion } from 'motion/react';
import { Scale, X, Zap, ArrowRight, Lock } from 'lucide-react';
import { Contract, CONTRACTS } from '../types';
import { useTranslation } from '../context/LanguageContext';

interface CompareViewProps {
  comparisonList: string[];
  onRemoveFromComparison: (id: string) => void;
  onNotify: (msg: string) => void;
  onViewChange: (view: any) => void;
}

export const CompareView: React.FC<CompareViewProps> = ({ 
  comparisonList, 
  onRemoveFromComparison,
  onNotify,
  onViewChange
}) => {
  const { t } = useTranslation();
  const selectedContracts = CONTRACTS.filter(c => comparisonList.includes(c.id));
  const MAX_SLOTS = 4;
  
  const getStatColor = (label: string, value: any, contract: Contract) => {
    if (label === t('LYA SCORE', 'SCORE LYA')) {
      const score = Number(value);
      if (score >= 850) return 'text-emerald-400';
      if (score >= 700) return 'text-accent-gold';
      return 'text-red-400';
    }
    if (label === t('UNIT VALUE', 'VALEUR UNITAIRE')) return 'text-primary-cyan';
    if (label === t('GROWTH', 'CROISSANCE')) {
      const growth = contract.growth;
      return growth >= 0 ? 'text-emerald-400' : 'text-red-400';
    }
    if (label === t('RARITY', 'RARETÉ')) {
      const rarity = String(value).toUpperCase();
      if (rarity === 'LEGENDARY') return 'text-accent-purple';
      if (rarity === 'EPIC') return 'text-primary-cyan';
      if (rarity === 'RARE') return 'text-accent-gold';
      return 'text-white';
    }
    return 'text-white';
  };

  const renderStatRow = (label: string, valueKey: keyof Contract | ((c: Contract) => React.ReactNode)) => (
    <div className={`grid border-b border-white/5 py-4 items-center`} style={{ gridTemplateColumns: `100px repeat(${MAX_SLOTS}, 1fr)` }}>
      <div className="text-[10px] uppercase tracking-widest text-on-surface-variant font-black italic">{label}</div>
      {selectedContracts.slice(0, MAX_SLOTS).map(contract => {
        const value = typeof valueKey === 'function' ? valueKey(contract) : contract[valueKey];
        return (
          <div key={`${contract.id}-${label}`} className={`text-center font-mono text-xs md:text-sm font-bold ${getStatColor(label, value, contract)}`}>
            {typeof value === 'object' && value !== null && !React.isValidElement(value) ? null : (value as React.ReactNode)}
          </div>
        );
      })}
      {/* Fill empty slots up to 4 */}
      {Array.from({ length: MAX_SLOTS - selectedContracts.length }).map((_, i) => (
        <div key={`empty-${label}-${i}`} className="text-center text-white/5 italic text-[10px] uppercase tracking-tighter">---</div>
      ))}
    </div>
  );

  return (
    <div className="space-y-12 pb-24">
      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 px-6">
        <div className="flex-1">
          <h1 className="text-3xl md:text-5xl font-black font-headline tracking-tighter text-on-surface leading-[0.9] uppercase italic mb-10 flex items-center gap-4">
            <div className="h-[2px] w-12 bg-primary-cyan"></div>
            <span>{t('Asset', 'COMPARAISON')} <span className="text-primary-cyan tracking-tighter">{t('Comparison', 'D\'ACTIFS')}</span></span>
          </h1>
          <p className="text-on-surface-variant max-w-xl text-[11px] md:text-sm leading-relaxed opacity-70 uppercase tracking-[0.3em] font-black border-l-2 border-primary-cyan pl-6 italic mb-10">
            {t('Side-by-side analysis of creative assets and market performance.', 'Analyse comparative des actifs créatifs et des performances du marché.')}
          </p>
        </div>
        
        <div className="flex gap-4">
          <div className="px-8 py-5 bg-surface-low border border-white/5 rounded-2xl backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="text-[10px] text-primary-cyan uppercase tracking-widest font-black mb-1 opacity-70">{t('Slots Active', 'Slots Actifs')}</div>
            <div className="flex items-center gap-2">
              <div className="text-3xl font-black text-white italic tracking-tighter">{selectedContracts.length} / {MAX_SLOTS}</div>
              <div className="flex gap-1.5 ml-2">
                {Array.from({ length: MAX_SLOTS }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-2.5 h-2.5 rounded-full border-2 border-surface-dim transition-all duration-500 ${i < selectedContracts.length ? 'bg-primary-cyan scale-110 shadow-[0_0_10px_rgba(0,224,255,0.5)]' : 'bg-white/10 opacity-30'}`} 
                  />
                ))}
              </div>
            </div>
          </div>

          {comparisonList.length > 0 && (
            <button 
              onClick={() => {
                comparisonList.forEach(id => onRemoveFromComparison(id));
                onNotify(t('COMPARISON LIST CLEARED', 'LISTE DE COMPARAISON EFFACÉE'));
              }}
              className="px-8 py-5 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 active:text-white transition-all rounded-2xl group flex flex-col items-center justify-center gap-1"
            >
              <X size={16} className="group-hover:rotate-90 transition-transform" />
              <span>{t('RESET', 'Vider')}</span>
            </button>
          )}
        </div>
      </header>

      {comparisonList.length === 0 ? (
        <div className="glass-panel p-24 rounded-[3rem] border-white/5 flex flex-col items-center justify-center text-center space-y-12 relative overflow-hidden group">
          <div className="absolute inset-0 bg-primary-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center border border-dashed border-white/10"
          >
            <Scale size={48} className="text-on-surface-variant/20" />
          </motion.div>
          <div className="space-y-4">
            <h3 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter leading-none">{t('NO PROJECTS SELECTED', 'AUCUN PROJET SÉLECTIONNÉ')}</h3>
            <p className="text-on-surface-variant text-sm max-w-xs mx-auto italic uppercase tracking-[0.2em] opacity-60">
              {t('Add projects from the Discovery section to compare their stats side-by-side.', 'Ajoutez des projets depuis la section Découverte pour comparer leurs statistiques.')}
            </p>
          </div>
          <button 
            onClick={() => onViewChange('SWIPE')}
            className="group relative px-10 py-5 bg-primary-cyan overflow-hidden rounded-xl shadow-[0_15px_30px_rgba(0,224,255,0.2)]"
          >
            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <div className="flex items-center gap-3 relative z-10 text-surface-dim font-black uppercase italic tracking-[0.2em] text-xs">
              {t('GO TO DISCOVERY', 'ACCÉDER AU TERMINAL')}
              <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
            </div>
          </button>
        </div>
      ) : (
        <div className="glass-panel rounded-[2.5rem] border-white/10 overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Top Row: Images & Names */}
            <div className={`grid border-b border-white/10`} style={{ gridTemplateColumns: `100px repeat(${MAX_SLOTS}, 1fr)` }}>
              <div className="p-8 bg-white/5 flex items-center justify-center">
                <div className="text-[10px] font-black uppercase tracking-[0.5em] text-on-surface-variant [writing-mode:vertical-lr] rotate-180 italic opacity-40">
                  {t('ASSET_PROFILE', 'PROFIL_ACTIF')}
                </div>
              </div>
              {selectedContracts.slice(0, MAX_SLOTS).map(contract => (
                <div key={contract.id} className="p-8 border-l border-white/5 relative group hover:bg-white/5 transition-colors">
                  <button 
                    onClick={() => onRemoveFromComparison(contract.id)}
                    className="absolute top-6 right-6 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all z-10 hover:scale-110 shadow-lg"
                  >
                    <X size={14} />
                  </button>
                  <div className="aspect-square rounded-2xl overflow-hidden mb-6 border border-white/10 shadow-2xl relative group-hover:scale-105 transition-transform duration-500">
                    <img src={contract.image} alt={contract.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-dim/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="text-xl font-black font-headline text-white tracking-tighter leading-none mb-1 uppercase italic">{contract.name}</h3>
                  <div className="text-[10px] text-primary-cyan font-black uppercase tracking-widest italic opacity-70">{contract.rarity}</div>
                </div>
              ))}
              {/* Empty slots up to 4 */}
              {Array.from({ length: MAX_SLOTS - selectedContracts.length }).map((_, i) => (
                <div key={`empty-slot-${i}`} className="p-8 border-l border-white/5 flex flex-col items-center justify-center text-center bg-white/[0.02]">
                  <div className="w-16 h-16 border-2 border-dashed border-white/5 rounded-[1.5rem] flex items-center justify-center mb-6 group cursor-pointer hover:border-primary-cyan/30 transition-colors" onClick={() => onViewChange('SWIPE')}>
                    <Plus size={28} className="text-white/5 group-hover:text-primary-cyan/30 transition-colors" />
                  </div>
                  <div className="text-[10px] font-black text-white/10 uppercase tracking-[0.3em] italic">{t('EMPTY SLOT', 'SLOT VIDE')}</div>
                </div>
              ))}
            </div>

            {/* Stats Grid */}
            <div className="p-8 space-y-0">
              {renderStatRow(t('LYA SCORE', 'SCORE LYA'), 'totalScore')}
              {renderStatRow(t('GROWTH', 'CROISSANCE'), (c) => `${c.growth >= 0 ? '+' : ''}${c.growth}%`)}
              {renderStatRow(t('UNIT VALUE', 'VALEUR UNITAIRE'), (c) => `$${c.unitValue?.toLocaleString() || '0'}`)}
              {renderStatRow(t('RARITY', 'RARETÉ'), 'rarity')}
              {renderStatRow(t('TOTAL SUPPLY', 'OFFRE TOTALE'), (c) => c.totalUnits?.toLocaleString() || '0')}
              {renderStatRow(t('MARKET CAP', 'CAP. BOURSIÈRE'), (c) => `$${c.totalValue?.toLocaleString() || '0'}`)}
              {renderStatRow(t('CREATOR', 'CRÉATEUR'), (c) => c.issuerId)}
              {renderStatRow(t('CATEGORY', 'CATÉGORIE'), 'category')}
              {renderStatRow(t('TYPE', 'TYPE'), (c) => c.contractType)}
              
              {/* Premium Footer Section */}
              <div className="mt-16 p-12 bg-gradient-to-br from-surface-low to-surface-low border border-white/10 rounded-[2.5rem] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity rotate-12 group-hover:rotate-0 duration-1000">
                  <Zap size={180} className="text-primary-cyan" />
                </div>
                <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-10">
                  <div className="space-y-4 text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-accent-gold animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent-gold italic">{t('STRATEGIC INSIGHT', 'ANALYSE STRATÉGIQUE')}</span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-black font-headline text-white tracking-tighter italic uppercase leading-none">
                      {t('Institutional Terminal', 'Terminal Institutionnel')}
                    </h3>
                    <p className="text-on-surface-variant text-sm md:text-base max-w-xl opacity-60 font-medium italic">
                      {t('Unlock deep-liquidity analysis and institutional-grade predictive metrics. Free tier is limited to 3 active slots.', 'Débloquez l\'analyse approfondie de la liquidité et des mesures prédictives de qualité institutionnelle. Le niveau gratuit est limité à 3 slots actifs.')}
                    </p>
                  </div>
                  <button 
                    onClick={() => onViewChange('PRICING')}
                    className="relative px-12 py-5 bg-white text-surface-dim font-black uppercase tracking-widest text-xs rounded-xl hover:bg-primary-cyan transition-all shadow-2xl active:scale-95 whitespace-nowrap italic"
                  >
                    {t('UPGRADE TO PROFESSIONAL', 'PASSER AU PROFESSIONNEL')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Plus = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

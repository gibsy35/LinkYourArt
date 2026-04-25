
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ShieldCheck, 
  Award, 
  ExternalLink, 
  Clock, 
  ArrowUpRight, 
  ArrowDownLeft,
  Activity,
  RefreshCw,
  Sparkles,
  Loader2,
  BookOpen,
  Zap,
  Building2,
  Users,
  Globe2,
  PieChart,
  TrendingUp,
  Fingerprint,
  FileSearch,
  Scale
} from 'lucide-react';
import { Contract } from '../types';
import { generateAssetAnalysis, generateInvestmentThesis } from '../services/geminiService';
import { useTranslation } from '../context/LanguageContext';

interface ContractDetailModalProps {
  contract: Contract | null;
  onClose: () => void;
  onTrade: (contract: Contract, type: 'BUY' | 'SELL') => void;
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Film': return 'bg-red-500/10 border-red-500/30 text-red-500';
    case 'TV Series': return 'bg-blue-500/10 border-blue-500/30 text-blue-500';
    case 'Music': return 'bg-pink-500/10 border-pink-500/30 text-pink-500';
    case 'Digital Art': return 'bg-primary-cyan/10 border-primary-cyan/30 text-primary-cyan';
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

export const ContractDetailModal: React.FC<ContractDetailModalProps> = ({ contract, onClose, onTrade }) => {
  const { t } = useTranslation();
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiThesis, setAiThesis] = useState<{ bullCase: string; bearCase: string; milestones: string[] } | null>(null);
  const [isGeneratingThesis, setIsGeneratingThesis] = useState(false);

  React.useEffect(() => {
    setAiAnalysis(null);
    setAiThesis(null);
    setIsAnalyzing(false);
    setIsGeneratingThesis(false);
  }, [contract?.id]);

  const handleAIAnalysis = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!contract || aiAnalysis || isAnalyzing) return;
    setIsAnalyzing(true);
    try {
      const analysis = await generateAssetAnalysis(contract.name, contract.description, contract.totalScore);
      setAiAnalysis(analysis);
    } catch (error) {
      console.error("AI Analysis failed", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateThesis = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!contract || aiThesis || isGeneratingThesis) return;
    setIsGeneratingThesis(true);
    try {
      const thesis = await generateInvestmentThesis(contract.name, contract.description, {
        totalValue: contract.totalValue,
        growth: contract.growth,
        stability: contract.stability,
        scarcity: contract.scarcity,
        totalScore: contract.totalScore
      });
      setAiThesis(thesis);
    } catch (error) {
      console.error("AI Thesis failed", error);
    } finally {
      setIsGeneratingThesis(false);
    }
  };

  return (
    <AnimatePresence>
      {contract && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-surface-dim/90 backdrop-blur-xl"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            className="relative w-full max-w-6xl bg-surface-low border border-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col md:flex-row max-h-[90vh] rounded-sm"
          >
            {/* Left Side: Immersive Image & Title */}
            <div className="w-full md:w-[45%] h-64 md:h-auto relative overflow-hidden bg-surface-dim">
              <img 
                src={contract.image} 
                alt={contract.name} 
                className="w-full h-full object-cover opacity-40 scale-105" 
                referrerPolicy="no-referrer" 
              />
              <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-surface-low via-surface-low/20 to-transparent" />
              
              <div className="absolute bottom-16 left-16 right-16">
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-[1px] w-12 bg-primary-cyan"></div>
                  <span className="text-xs font-mono text-primary-cyan uppercase tracking-[0.5em] font-medium">{contract.registryIndex}</span>
                </div>
                <h2 className="text-5xl md:text-6xl font-light font-headline text-on-surface tracking-tighter uppercase leading-[0.85] mb-6">{contract.name}</h2>
                <div className="flex flex-wrap items-center gap-4">
                  <div className={`px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] border backdrop-blur-xl ${
                    contract.rarity === 'Legendary' ? 'bg-accent-gold/10 border-accent-gold/30 text-accent-gold' :
                    contract.rarity === 'Epic' ? 'bg-purple-500/10 border-purple-500/30 text-purple-500' :
                    'bg-primary-cyan/10 border-primary-cyan/30 text-primary-cyan'
                  }`}>
                    {contract.rarity}
                  </div>
                  <div className={`px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] border backdrop-blur-xl ${getCategoryColor(contract.category)}`}>
                    {contract.category}
                  </div>
                  <div className={`px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] border backdrop-blur-xl ${getStatusColor(contract.assetStatus)}`}>
                    {contract.assetStatus}
                  </div>
                  <p className="text-on-surface-variant font-serif italic text-lg opacity-40">By {contract.issuerId}</p>
                </div>
              </div>
            </div>

            {/* Right Side: Detailed Intelligence */}
            <div className="w-full md:w-[55%] p-12 md:p-20 overflow-y-auto custom-scrollbar bg-surface-low/30 backdrop-blur-md relative">
              <button onClick={onClose} className="absolute top-12 right-12 p-2 text-on-surface-variant hover:text-primary-cyan transition-colors z-50">
                <X size={28} strokeWidth={1.5} />
              </button>

              <div className="max-w-xl mx-auto space-y-20">
                {/* Description & Thesis */}
                <section className="space-y-12">
                  <div className="space-y-6">
                    <h3 className="text-[10px] uppercase tracking-[0.5em] text-primary-cyan font-bold flex items-center gap-4 opacity-60">
                      <ShieldCheck size={16} strokeWidth={1.5} />
                      {t('Executive Summary', 'Résumé Exécutif')}
                    </h3>
                    <p className="text-on-surface-variant text-lg leading-relaxed opacity-70 font-serif italic">{contract.description}</p>
                  </div>

                  {/* AI Investment Thesis - More Institutional */}
                  <div className="bg-white/[0.01] border border-white/5 p-10 relative overflow-hidden group rounded-sm">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Sparkles size={60} className="text-primary-cyan" />
                    </div>
                    
                    <div className="flex items-center justify-between mb-10">
                      <h4 className="text-[10px] uppercase tracking-[0.4em] text-on-surface font-bold flex items-center gap-4">
                        <BookOpen size={16} className="text-primary-cyan" strokeWidth={1.5} />
                        {t('Institutional Thesis', 'Thèse Institutionnelle')}
                      </h4>
                      {!aiThesis && (
                        <button 
                          onClick={handleGenerateThesis}
                          disabled={isGeneratingThesis}
                          className="px-5 py-2.5 bg-primary-cyan/5 border border-primary-cyan/20 text-[9px] uppercase tracking-[0.2em] text-primary-cyan hover:bg-primary-cyan hover:text-surface-dim transition-all flex items-center gap-3 font-bold rounded-sm"
                        >
                          {isGeneratingThesis ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                          {isGeneratingThesis ? 'Synthesizing...' : 'Generate Analysis'}
                        </button>
                      )}
                    </div>

                    {aiThesis ? (
                      <div className="grid grid-cols-1 gap-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                          <div className="space-y-4">
                            <p className="text-[9px] uppercase tracking-[0.3em] text-emerald-400 font-bold flex items-center gap-3">
                              <ArrowDownLeft size={12} />
                              Bull Case
                            </p>
                            <p className="text-xs text-on-surface-variant leading-relaxed opacity-60 font-light">{aiThesis.bullCase}</p>
                          </div>
                          <div className="space-y-4">
                            <p className="text-[9px] uppercase tracking-[0.3em] text-red-400 font-bold flex items-center gap-3">
                              <ArrowUpRight size={12} />
                              Bear Case
                            </p>
                            <p className="text-xs text-on-surface-variant leading-relaxed opacity-60 font-light">{aiThesis.bearCase}</p>
                          </div>
                        </div>
                        <div className="pt-8 border-t border-white/5 space-y-6">
                          <p className="text-[9px] uppercase tracking-[0.3em] text-accent-gold font-bold">{t('Strategic Milestones', 'Jalons Stratégiques')}</p>
                          <div className="flex flex-wrap gap-3">
                            {aiThesis.milestones.map((m, i) => (
                              <div key={i} className="px-4 py-2 bg-white/5 border border-white/10 text-[9px] text-on-surface-variant uppercase tracking-[0.2em] font-medium rounded-sm">
                                {m}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="py-12 text-center border border-dashed border-white/5 rounded-sm">
                        <p className="text-[10px] text-on-surface-variant/30 uppercase tracking-[0.3em] italic">
                          {t('Awaiting AI Synthesis Protocol...', 'En attente du protocole de synthèse IA...')}
                        </p>
                      </div>
                    )}
                  </div>
                </section>

                {/* Metrics Grid */}
                <section className="grid grid-cols-2 gap-16">
                  <div className="space-y-10">
                    <h3 className="text-[10px] uppercase tracking-[0.5em] text-on-surface-variant font-bold opacity-40">{t('Asset Performance', 'Performance de l\'Actif')}</h3>
                    <div className="space-y-8">
                      {[
                        { label: t('Project Value', 'Valeur du Projet'), value: `$${contract.totalValue?.toLocaleString() || '0'}`, color: 'text-accent-gold' },
                        { label: t('Unit Price', 'Prix Unitaire'), value: `$${contract.unitValue?.toLocaleString() || '0'}`, color: 'text-primary-cyan' },
                        { label: t('Growth (YTD)', 'Croissance (YTD)'), value: `+${contract.growth}%`, color: 'text-emerald-400' }
                      ].map(stat => (
                        <div key={stat.label} className="group">
                          <p className="text-[9px] uppercase tracking-[0.3em] text-on-surface-variant/40 mb-2 font-bold">{stat.label}</p>
                          <p className={`text-3xl font-light font-headline tracking-tighter ${stat.color}`}>{stat.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-10">
                    <h3 className="text-[10px] uppercase tracking-[0.5em] text-on-surface-variant font-bold opacity-40">{t('Market Availability', 'Disponibilité du Marché')}</h3>
                    <div className="space-y-8">
                      <div className="group">
                        <p className="text-[9px] uppercase tracking-[0.3em] text-on-surface-variant/40 mb-2 font-bold">{t('Available Stock', 'Stock Disponible')}</p>
                        <div className="flex items-baseline gap-3">
                          <p className="text-3xl font-light font-headline tracking-tighter text-primary-cyan">
                            {contract.availableUnits?.toLocaleString() || '0'}
                          </p>
                          <p className="text-xs font-mono text-on-surface-variant opacity-40 uppercase tracking-widest">
                            / {contract.totalUnits?.toLocaleString() || '0'} Units
                          </p>
                        </div>
                        <div className="mt-4 h-[2px] bg-white/5 relative overflow-hidden rounded-full">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${((contract.availableUnits || 0) / contract.totalUnits) * 100}%` }}
                            className="absolute h-full bg-primary-cyan shadow-[0_0_10px_rgba(0,224,255,0.5)]"
                          />
                        </div>
                        <p className="text-[10px] font-mono text-on-surface-variant opacity-40 uppercase tracking-widest mt-2">
                          {(((contract.availableUnits || 0) / contract.totalUnits) * 100).toFixed(1)}% {t('of total supply available for P2P exchange', 'de l\'offre totale disponible pour l\'échange P2P')}
                        </p>
                      </div>

                      <div className="pt-8 border-t border-white/5">
                        <h3 className="text-[10px] uppercase tracking-[0.5em] text-on-surface-variant font-bold opacity-40 mb-6">{t('Scoring Pillars', 'Piliers de Notation')}</h3>
                        <div className="space-y-6">
                          {contract.pillars.map((item, i) => {
                            const colors = ['bg-primary-cyan', 'bg-accent-pink', 'bg-accent-green', 'bg-accent-purple', 'bg-accent-gold'];
                            return (
                              <div key={item.label} className="space-y-2">
                                <div className="flex justify-between text-[9px] uppercase tracking-[0.2em] font-bold">
                                  <span className="text-on-surface-variant/40">{item.label}</span>
                                  <span className="text-on-surface">{item.score}</span>
                                </div>
                                <div className="h-[1px] w-full bg-white/5 overflow-hidden">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(item.score / 200) * 100}%` }}
                                    className={`h-full ${colors[i % colors.length]} opacity-60`}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Action Footer */}
                <div className="flex flex-col sm:flex-row gap-4 pt-16 border-t border-white/5">
                  <button 
                    onClick={() => {
                      onClose();
                      onTrade(contract, 'BUY');
                    }}
                    className="flex-[2] bg-primary-cyan text-surface-dim py-6 px-10 text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-white transition-all active:scale-95 flex items-center justify-center gap-4 shadow-[0_20px_40px_rgba(0,224,255,0.15)] rounded-sm"
                  >
                    <ArrowDownLeft size={18} />
                    {t('Acquire Institutional Units', 'Acquérir des Unités Institutionnelles')}
                  </button>
                  <button 
                    onClick={() => {
                      onClose();
                      onTrade(contract, 'SELL');
                    }}
                    className="flex-1 border border-white/10 text-on-surface-variant py-6 px-10 text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-white/5 hover:text-on-surface transition-all active:scale-95 flex items-center justify-center gap-4 rounded-sm"
                  >
                    <ArrowUpRight size={18} />
                    {t('Transfer Units', 'Transférer des Unités')}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
      </div>
    )}
  </AnimatePresence>
);
};

interface InstitutionalOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: () => void;
  isVerifying: boolean;
}

export const InstitutionalOnboardingModal: React.FC<InstitutionalOnboardingModalProps> = ({ isOpen, onClose, onVerify, isVerifying }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-surface-dim/95 backdrop-blur-2xl"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl bg-surface-low border border-white/10 p-12 overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-primary-cyan shadow-[0_0_15px_rgba(0,255,255,0.5)]" />
          
          <div className="text-center space-y-8">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-primary-cyan/10 border border-primary-cyan/20 flex items-center justify-center text-primary-cyan relative">
                <ShieldCheck size={40} />
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-primary-cyan/20 rounded-full"
                />
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-black font-headline text-on-surface tracking-tighter uppercase mb-4">Institutional Verification</h2>
              <p className="text-on-surface-variant text-sm leading-relaxed max-w-md mx-auto opacity-70">
                To access the LYA Institutional Registry and trade high-value creative equity contracts, you must complete the node verification protocol.
              </p>
              <div className="mt-4 flex items-center justify-center gap-2 text-[8px] text-primary-cyan uppercase tracking-[0.3em] font-bold">
                <Activity size={10} />
                Powered by LYA Algorithm v4.2
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              {[
                { icon: <Award size={16} />, label: 'KYC/AML', desc: 'Global Compliance' },
                { icon: <Activity size={16} />, label: 'Liquidity', desc: 'Min $1M Reserve' },
                { icon: <Clock size={16} />, label: 'Maturity', desc: '24M Track Record' }
              ].map(item => (
                <div key={item.label} className="p-4 bg-surface-dim border border-white/5">
                  <div className="text-primary-cyan mb-2">{item.icon}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface mb-1">{item.label}</div>
                  <div className="text-[8px] text-on-surface-variant uppercase tracking-widest">{item.desc}</div>
                </div>
              ))}
            </div>

            <div className="pt-8 flex flex-col sm:flex-row gap-4">
              <button 
                onClick={onClose}
                className="flex-1 py-4 px-6 border border-white/10 text-on-surface-variant text-xs font-bold uppercase tracking-[0.2em] hover:bg-white/5 hover:border-white/20 hover:text-on-surface transition-all active:scale-95"
              >
                Cancel
              </button>
              <button 
                onClick={onVerify}
                disabled={isVerifying}
                className="flex-1 py-4 px-6 bg-primary-cyan text-surface-dim text-xs font-bold uppercase tracking-[0.2em] border border-primary-cyan hover:bg-white hover:border-white transition-all shadow-[0_0_20px_rgba(0,255,255,0.3)] disabled:opacity-50 flex items-center justify-center gap-3 active:scale-95"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Verifying Node...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={16} />
                    Begin Verification
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

interface TradeModalProps {
  tradingContract: { contract: Contract, type: 'BUY' | 'SELL' } | null;
  onClose: () => void;
  onTrade: (contract: Contract, type: 'BUY' | 'SELL', price: number, volume: number) => void;
  tradeVolume: number;
  setTradeVolume: (val: number) => void;
  tradePrice: number;
  setTradePrice: (val: number) => void;
}

export const TradeModal: React.FC<TradeModalProps> = ({
  tradingContract,
  onClose,
  onTrade,
  tradeVolume,
  setTradeVolume,
  tradePrice,
  setTradePrice
}) => {
  const { t } = useTranslation();
  return (
    <AnimatePresence>
      {tradingContract && (
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-surface-dim/95 backdrop-blur-2xl"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-surface-low border border-white/10 p-8 rounded-sm"
        >
          <div className={`absolute top-0 left-0 w-full h-1 ${tradingContract.type === 'BUY' ? 'bg-emerald-400' : 'bg-red-400'} shadow-[0_0_15px_rgba(0,0,0,0.5)]`} />
          
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-black font-headline text-on-surface tracking-tighter uppercase">
                {tradingContract.type === 'BUY' ? 'Acquire' : 'Transfer'} Units
              </h2>
              <p className="text-on-surface-variant text-[10px] uppercase tracking-widest mt-1">{tradingContract.contract.name}</p>
            </div>
            <button onClick={onClose} className="p-2 text-on-surface-variant hover:text-on-surface transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Market Depth Info */}
            <div className="p-4 bg-primary-cyan/5 border border-primary-cyan/10 rounded-sm">
              <div className="flex justify-between items-center">
                <span className="text-[9px] uppercase tracking-widest text-primary-cyan font-bold opacity-60">
                  {t('Market Depth', 'Profondeur du Marché')}
                </span>
                <span className="text-[10px] font-mono text-primary-cyan">
                  {tradingContract.contract.availableUnits?.toLocaleString() || '0'} Units Available
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Contract Units</label>
              <input 
                type="number" 
                value={tradeVolume}
                onChange={(e) => setTradeVolume(Number(e.target.value))}
                className="w-full bg-surface-dim border border-white/10 text-on-surface p-4 focus:border-primary-cyan/50 focus:ring-0 transition-all font-mono outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Contract Value per Unit (USD/EUR)</label>
              <input 
                type="number" 
                value={tradePrice}
                onChange={(e) => setTradePrice(Number(e.target.value))}
                className="w-full bg-surface-dim border border-white/10 text-on-surface p-4 focus:border-primary-cyan/50 focus:ring-0 transition-all font-mono outline-none"
              />
            </div>

            <div className="p-4 bg-surface-dim border border-white/5 space-y-2">
              <div className="flex justify-between text-[10px] uppercase tracking-widest text-on-surface-variant">
                <span>Total Contract Value</span>
                <span className="text-on-surface font-bold">${(tradeVolume * tradePrice)?.toLocaleString() || '0'}</span>
              </div>
              <div className="flex justify-between text-[10px] uppercase tracking-widest text-on-surface-variant">
                <span>P2P Exchange Fee (3%)</span>
                <span className="text-on-surface font-bold">${(tradeVolume * tradePrice * 0.03)?.toLocaleString() || '0'}</span>
              </div>
              <div className="pt-2 border-t border-white/5 flex justify-between text-xs uppercase tracking-widest font-black">
                <span className="text-primary-cyan">Total Settlement</span>
                <span className="text-primary-cyan">${(tradeVolume * tradePrice * 1.03)?.toLocaleString() || '0'}</span>
              </div>
              <p className="text-[8px] text-on-surface-variant/40 uppercase tracking-widest italic text-center mt-2">
                * Fees range from 2% to 5% based on your institutional tier.
              </p>
            </div>

            <button 
              onClick={() => onTrade(tradingContract.contract, tradingContract.type, tradePrice, tradeVolume)}
              className={`w-full py-4 px-6 ${tradingContract.type === 'BUY' ? 'bg-emerald-400 border-emerald-400' : 'bg-red-400 border-red-400'} text-surface-dim text-xs font-bold uppercase tracking-[0.2em] border hover:bg-white hover:border-white transition-all active:scale-95 shadow-[0_0_20px_rgba(0,0,0,0.3)]`}
            >
              Execute {tradingContract.type === 'BUY' ? 'Acquisition' : 'Transfer'}
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);
};

interface FeatureShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureId: 'CREATOR' | 'INVESTOR' | 'PRO' | 'INSTITUTIONAL_AUDIT' | 'LIQUIDITY_POOL' | 'PREDICTIVE_SCORE';
}

export const FeatureShowcaseModal: React.FC<FeatureShowcaseModalProps> = ({ isOpen, onClose, featureId }) => {
  const { t } = useTranslation();
  
  const featureData = {
    CREATOR: {
      title: t('Creator Protocol', 'Protocole Créateur'),
      subtitle: t('Index your creative legacy', 'Indexez votre héritage créatif'),
      icon: <Zap className="text-primary-cyan" size={40} />,
      color: 'primary-cyan',
      previewImage: 'https://picsum.photos/seed/creator-protocol/1200/600',
      description: t('The Creator tier allows artists and production houses to tokenize their future revenue streams. By indexing your project, you gain immediate access to institutional liquidity while maintaining creative control.', 'Le niveau Créateur permet aux artistes et aux maisons de production de tokeniser leurs futurs flux de revenus. En indexant votre projet, vous accédez immédiatement à la liquidité institutionnelle tout en conservant le contrôle créatif.'),
      benefits: [
        { icon: <Fingerprint size={16} />, label: t('IP Tokenization', 'Tokenisation de la PI'), desc: t('Convert legal rights into tradable LYA Units.', 'Convertissez les droits légaux en Unités LYA échangeables.') },
        { icon: <Globe2 size={16} />, label: t('Global Exposure', 'Exposition Mondiale'), desc: t('List your project on the institutional registry.', 'Inscrivez votre projet sur le registre institutionnel.') },
        { icon: <Activity size={16} />, label: t('Real-time Yield', 'Rendement en Temps Réel'), desc: t('Track revenue performance through the LYA Index.', 'Suivez la performance des revenus via l\'Indice LYA.') }
      ]
    },
    INVESTOR: {
      title: t('Investor Suite', 'Suite Investisseur'),
      subtitle: t('Institutional-grade creative equity', 'Actions créatives de qualité institutionnelle'),
      icon: <Award className="text-accent-gold" size={40} />,
      color: 'accent-gold',
      previewImage: 'https://picsum.photos/seed/investor-suite/1200/600',
      description: t('The Investor tier provides access to the primary and secondary markets of creative contracts. Build a diversified portfolio of high-yield artistic assets backed by the LYA Protocol.', 'Le niveau Investisseur donne accès aux marchés primaire et secondaire des contrats créatifs. Construisez un portefeuille diversifié d\'actifs artistiques à haut rendement soutenus par le Protocole LYA.'),
      benefits: [
        { icon: <PieChart size={16} />, label: t('Portfolio Alpha', 'Alpha de Portefeuille'), desc: t('Access non-correlated artistic asset classes.', 'Accédez à des classes d\'actifs artistiques non corrélées.') },
        { icon: <TrendingUp size={16} />, label: t('Yield Optimization', 'Optimisation du Rendement'), desc: t('Automated reinvestment of revenue shares.', 'Réinvestissement automatisé des parts de revenus.') },
        { icon: <ShieldCheck size={16} />, label: t('Secured Custody', 'Garde Sécurisée'), desc: t('Institutional-grade vaulting for all LYA Units.', 'Voûtage de qualité institutionnelle pour toutes les Unités LYA.') }
      ]
    },
    PRO: {
      title: t('Pro Institutional', 'Pro Institutionnel'),
      subtitle: t('Advanced market intelligence', 'Intelligence de marché avancée'),
      icon: <Building2 className="text-accent-purple" size={40} />,
      color: 'accent-purple',
      previewImage: 'https://picsum.photos/seed/pro-institutional/1200/600',
      description: t('The Pro tier is designed for funds, galleries, and major studios. It unlocks the full power of the LYA Algorithm, including deep-dive audits and predictive market sentiment.', 'Le niveau Pro est conçu pour les fonds, les galeries et les grands studios. Il débloque toute la puissance de l\'Algorithme LYA, y compris les audits approfondis et le sentiment de marché prédictif.'),
      benefits: [
        { icon: <FileSearch size={16} />, label: t('Deep-Dive Audits', 'Audits Approfondis'), desc: t('Full access to underlying legal and financial data.', 'Accès complet aux données juridiques et financières sous-jacentes.') },
        { icon: <Users size={16} />, label: t('Multi-Seat Access', 'Accès Multi-Sièges'), desc: t('Manage team permissions and shared portfolios.', 'Gérez les permissions d\'équipe et les portefeuilles partagés.') },
        { icon: <Zap size={16} />, label: t('Priority Execution', 'Exécution Prioritaire'), desc: t('Zero-latency settlement on the secondary market.', 'Règlement sans latence sur le marché secondaire.') }
      ]
    },
    INSTITUTIONAL_AUDIT: {
      title: t('Institutional Audit', 'Audit Institutionnel'),
      subtitle: t('Deep-layer legal verification', 'Vérification juridique en couche profonde'),
      icon: <ShieldCheck className="text-primary-cyan" size={40} />,
      color: 'primary-cyan',
      previewImage: 'https://picsum.photos/seed/institutional-audit/1200/600',
      description: t('Every contract on LinkYourArt undergoes a rigorous multi-stage audit. This service provides a 360-degree view of the legal, financial, and creative robustness of an asset.', 'Chaque contrat sur LinkYourArt subit un audit rigoureux en plusieurs étapes. Ce service offre une vue à 360 degrés de la robustesse juridique, financière et créative d\'un actif.'),
      benefits: [
        { icon: <FileSearch size={16} />, label: t('Chain of Title', 'Chaîne de Titre'), desc: t('Verification of all underlying IP ownership.', 'Vérification de toute la propriété intellectuelle sous-jacente.') },
        { icon: <Activity size={16} />, label: t('Revenue Audit', 'Audit des Revenus'), desc: t('Historical and projected revenue verification.', 'Vérification des revenus historiques et projetés.') },
        { icon: <Scale size={16} />, label: t('Compliance Check', 'Contrôle de Conformité'), desc: t('Jurisdictional regulatory alignment (MiCA/SEC).', 'Alignement réglementaire juridictionnel (MiCA/SEC).') }
      ]
    },
    LIQUIDITY_POOL: {
      title: t('Liquidity Pool', 'Pool de Liquidité'),
      subtitle: t('Instant secondary market exit', 'Sortie instantanée du marché secondaire'),
      icon: <RefreshCw className="text-accent-gold" size={40} />,
      color: 'accent-gold',
      previewImage: 'https://picsum.photos/seed/liquidity-pool/1200/600',
      description: t('The LYA Liquidity Pool ensures that creative assets remain liquid. Institutional members can exit positions instantly through our automated market maker protocol.', 'Le Pool de Liquidité LYA garantit que les actifs créatifs restent liquides. Les membres institutionnels peuvent sortir de leurs positions instantanément via notre protocole de teneur de marché automatisé.'),
      benefits: [
        { icon: <Zap size={16} />, label: t('Instant Exit', 'Sortie Instantanée'), desc: t('No need to wait for a peer-to-peer buyer.', 'Pas besoin d\'attendre un acheteur de pair à pair.') },
        { icon: <TrendingUp size={16} />, label: t('Price Stability', 'Stabilité des Prix'), desc: t('Algorithmic balancing to prevent slippage.', 'Équilibrage algorithmique pour éviter le glissement.') },
        { icon: <PieChart size={16} />, label: t('Yield Farming', 'Yield Farming'), desc: t('Earn fees by providing liquidity to the network.', 'Gagnez des frais en fournissant de la liquidité au réseau.') }
      ]
    },
    PREDICTIVE_SCORE: {
      title: t('Predictive LYA Score', 'Score LYA Prédictif'),
      subtitle: t('AI-driven yield forecasting', 'Prévision de rendement pilotée par l\'IA'),
      icon: <Sparkles className="text-accent-purple" size={40} />,
      color: 'accent-purple',
      previewImage: 'https://picsum.photos/seed/predictive-score/1200/600',
      description: t('Move beyond historical data. Our predictive engine uses machine learning to forecast the future performance of creative contracts based on global trends.', 'Allez au-delà des données historiques. Notre moteur prédictif utilise l\'apprentissage automatique pour prévoir la performance future des contrats créatifs basée sur les tendances mondiales.'),
      benefits: [
        { icon: <Activity size={16} />, label: t('Trend Analysis', 'Analyse des Tendances'), desc: t('Real-time ingestion of social and market data.', 'Ingestion en temps réel des données sociales et du marché.') },
        { icon: <TrendingUp size={16} />, label: t('Yield Projection', 'Projection de Rendement'), desc: t('36-month estimated ROI curves.', 'Courbes de ROI estimées sur 36 mois.') },
        { icon: <ShieldCheck size={16} />, label: t('Risk Mitigation', 'Atténuation des Risques'), desc: t('Early warning system for asset volatility.', 'Système d\'alerte précoce pour la volatilité des actifs.') }
      ]
    }
  };

  const data = featureData[featureId];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 md:p-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-surface-dim/95 backdrop-blur-3xl"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl bg-surface-low border border-white/10 overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)] rounded-sm"
          >
            {/* Header Visual */}
            <div className="h-48 md:h-64 relative overflow-hidden bg-surface-dim">
              <img 
                src={data.previewImage} 
                alt={data.title} 
                className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-1000"
                referrerPolicy="no-referrer"
              />
              <div className={`absolute inset-0 bg-gradient-to-br from-${data.color}/40 via-surface-dim/60 to-surface-dim`} />
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:30px_30px]" />
              
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className={`w-20 h-20 bg-surface-dim border border-${data.color}/30 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(0,0,0,0.5)]`}
                >
                  {data.icon}
                </motion.div>
                <h2 className="text-3xl md:text-5xl font-black font-headline text-white tracking-tighter uppercase italic leading-none mb-2">
                  {data.title}
                </h2>
                <p className={`text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-${data.color} opacity-80`}>
                  {data.subtitle}
                </p>
              </div>
            </div>

            <div className="p-8 md:p-12 grid md:grid-cols-5 gap-12">
              <div className="md:col-span-3 space-y-8">
                <div className="space-y-4">
                  <h3 className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-black flex items-center gap-3">
                    <BookOpen size={14} className={`text-${data.color}`} />
                    {t('Service Overview', 'Présentation du Service')}
                  </h3>
                  <p className="text-sm md:text-base text-on-surface-variant leading-relaxed font-serif italic opacity-80">
                    {data.description}
                  </p>
                </div>

                <div className="pt-8 border-t border-white/5">
                  <button 
                    onClick={onClose}
                    className={`w-full py-4 bg-${data.color} text-surface-dim text-xs font-black uppercase tracking-[0.3em] hover:bg-white transition-all active:scale-95 shadow-[0_20px_40px_rgba(0,0,0,0.3)]`}
                  >
                    {t('Unlock Access Now', 'Débloquer l\'Accès Maintenant')}
                  </button>
                </div>
              </div>

              <div className="md:col-span-2 space-y-6">
                <h3 className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-black">
                  {t('Key Benefits', 'Avantages Clés')}
                </h3>
                <div className="space-y-4">
                  {data.benefits.map((benefit, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className="p-4 bg-white/[0.02] border border-white/5 rounded-sm group hover:border-white/10 transition-all"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`text-${data.color} opacity-60 group-hover:opacity-100 transition-opacity`}>
                          {benefit.icon}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">
                          {benefit.label}
                        </span>
                      </div>
                      <p className="text-[10px] text-on-surface-variant leading-relaxed opacity-60 uppercase font-bold tracking-tighter">
                        {benefit.desc}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="absolute top-8 right-8 p-2 text-on-surface-variant hover:text-white transition-all active:scale-95"
            >
              <X size={24} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

interface ComplianceCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  contract: Contract | null;
}

export const ComplianceCertificateModal: React.FC<ComplianceCertificateModalProps> = ({ isOpen, onClose, contract }) => {
  const { t } = useTranslation();
  if (!contract) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-surface-dim/95 backdrop-blur-2xl"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="relative w-full max-w-3xl bg-white text-surface-dim overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] rounded-sm font-serif"
          >
            {/* Certificate Border */}
            <div className="absolute inset-4 border-4 border-double border-surface-dim/20 pointer-events-none" />
            <div className="absolute inset-6 border border-surface-dim/10 pointer-events-none" />
            
            <div className="p-12 md:p-20 flex flex-col items-center text-center relative z-10">
              <div className="mb-10">
                <ShieldCheck size={80} className="text-surface-dim opacity-20" />
              </div>
              
              <div className="space-y-2 mb-12">
                <h3 className="text-xs uppercase tracking-[0.5em] font-sans font-black opacity-40">Institutional Registry of Creative Assets</h3>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter italic">Certificate of Compliance</h2>
              </div>
              
              <div className="w-24 h-[1px] bg-surface-dim/20 mb-12" />
              
              <p className="text-lg md:text-xl leading-relaxed max-w-xl mb-12 italic opacity-80">
                This document formally certifies that the creative contract identified as 
                <span className="font-sans font-black not-italic mx-2 uppercase tracking-tight text-surface-dim underline decoration-surface-dim/20 decoration-2 underline-offset-4">
                  {contract.name}
                </span> 
                has successfully completed the LYA Institutional Audit and is fully compliant with the global regulatory standards for creative equity indexing.
              </p>
              
              <div className="grid grid-cols-2 gap-12 w-full max-w-lg mb-16 text-left font-sans">
                <div>
                  <p className="text-[9px] uppercase tracking-widest opacity-40 mb-1">Registry Index</p>
                  <p className="text-sm font-black tracking-widest">{contract.registryIndex}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-widest opacity-40 mb-1">Verification Date</p>
                  <p className="text-sm font-black tracking-widest">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-widest opacity-40 mb-1">Jurisdiction</p>
                  <p className="text-sm font-black tracking-widest">EU (MiCA) / GLOBAL</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-widest opacity-40 mb-1">Audit Hash</p>
                  <p className="text-sm font-black tracking-widest font-mono opacity-60">0x{Math.random().toString(16).slice(2, 14).toUpperCase()}</p>
                </div>
              </div>
              
              <div className="flex justify-between items-end w-full max-w-lg">
                <div className="text-left">
                  <div className="w-32 h-[1px] bg-surface-dim/40 mb-2" />
                  <p className="text-[9px] uppercase tracking-[0.3em] font-black">Authorized Signatory</p>
                  <p className="text-[8px] uppercase tracking-widest opacity-40">LYA Protocol Governance</p>
                </div>
                <div className="relative">
                  <div className="w-24 h-24 border-4 border-surface-dim/10 rounded-full flex items-center justify-center opacity-20 rotate-12">
                    <span className="text-[10px] font-black uppercase tracking-widest text-center">OFFICIAL<br/>SEAL</span>
                  </div>
                  <Award size={40} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-surface-dim opacity-10" />
                </div>
              </div>
              
              <div className="mt-16 flex gap-4 no-print">
                <button 
                  onClick={onClose}
                  className="px-8 py-3 bg-surface-dim text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all active:scale-95 rounded-sm"
                >
                  {t('Close', 'Fermer')}
                </button>
                <button 
                  onClick={() => window.print()}
                  className="px-8 py-3 border border-surface-dim/20 text-surface-dim text-[10px] font-black uppercase tracking-[0.2em] hover:bg-surface-dim/5 transition-all active:scale-95 rounded-sm flex items-center gap-2"
                >
                  <ExternalLink size={12} /> {t('Download PDF', 'Télécharger PDF')}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

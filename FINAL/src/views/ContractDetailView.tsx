
import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Activity, 
  TrendingUp, 
  Globe, 
  FileText, 
  Award, 
  Clock, 
  ExternalLink,
  ChevronRight,
  Download,
  Lock,
  Zap,
  BarChart3,
  PieChart as PieChartIcon,
  MessageSquare,
  Send,
  User,
  Star,
  Star as StarFilled
} from 'lucide-react';
import { Contract, PillarScore } from '../types';
import { useTranslation } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';

interface ContractDetailViewProps {
  contract: Contract;
  onBack: () => void;
  onTrade: (contract: Contract, type: 'BUY' | 'SELL') => void;
  onPlaceOrder: (contract: Contract, type: 'BUY' | 'SELL', price: number, volume: number) => void;
  onNotify: (msg: string) => void;
  isWatchlisted?: boolean;
  onToggleWatchlist?: (e: React.MouseEvent, id: string) => void;
}

export const ContractDetailView: React.FC<ContractDetailViewProps> = ({ 
  contract, 
  onBack, 
  onTrade, 
  onPlaceOrder, 
  onNotify,
  isWatchlisted = false,
  onToggleWatchlist
}) => {
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();
  const [activeTab, setActiveTab] = useState<'overview' | 'financials' | 'legal' | 'milestones' | 'messaging'>('overview');
  const [priceTimeframe, setPriceTimeframe] = useState<'1D' | '1W' | '1M' | '1Y' | 'ALL'>('1M');
  const [revenueTimeframe, setRevenueTimeframe] = useState<'1D' | '1W' | '1M' | '1Y' | 'ALL'>('1M');

  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: '1', sender: 'LYA Protocol', content: 'Secure communication channel established for this project.', time: 'System' },
    { id: '2', sender: 'Institutional Node', content: 'Verification complete. Project ready for institutional engagement.', time: '10:45 AM' },
  ]);

  const [orderVolume, setOrderVolume] = useState(1);
  const [orderPrice, setOrderPrice] = useState(contract.unitValue);

  const handleExecuteOrder = (type: 'BUY' | 'SELL') => {
    if (orderVolume <= 0) {
      onNotify(t('INVALID VOLUME', 'VOLUME INVALIDE'));
      return;
    }
    if (orderPrice <= 0) {
      onNotify(t('INVALID PRICE', 'PRIX INVALIDE'));
      return;
    }
    onPlaceOrder(contract, type, orderPrice, orderVolume);
  };

  // Mock historical revenue data
  const revenueData = useMemo(() => {
    const baseData = [
      { month: 'Oct 25', revenue: 12500, projection: 12000 },
      { month: 'Nov 25', revenue: 15800, projection: 14000 },
      { month: 'Dec 25', revenue: 14200, projection: 15000 },
      { month: 'Jan 26', revenue: 18900, projection: 17000 },
      { month: 'Feb 26', revenue: 22400, projection: 20000 },
      { month: 'Mar 26', revenue: 25600, projection: 24000 },
    ];

    if (revenueTimeframe === '1D') return baseData.slice(-1).map(d => ({ ...d, month: 'Today' }));
    if (revenueTimeframe === '1W') return baseData.slice(-2);
    if (revenueTimeframe === '1M') return baseData.slice(-4);
    return baseData;
  }, [revenueTimeframe]);

  const pillarData = contract.pillars.map(p => ({
    name: p.label,
    value: p.score,
    full: 200
  }));

  const COLORS = ['#00E0FF', '#FFD700', '#FF00FF', '#00FF00', '#FF4500'];

  // Mock price history data
  const priceHistory = useMemo(() => {
    const baseHistory = [
      { date: '2025-10', price: contract.unitValue * 0.85 },
      { date: '2025-11', price: contract.unitValue * 0.88 },
      { date: '2025-12', price: contract.unitValue * 0.92 },
      { date: '2026-01', price: contract.unitValue * 0.95 },
      { date: '2026-02', price: contract.unitValue * 0.98 },
      { date: '2026-03', price: contract.unitValue },
    ];

    if (priceTimeframe === '1D') return [{ date: '09:00', price: contract.unitValue * 0.99 }, { date: '12:00', price: contract.unitValue * 1.01 }, { date: '17:00', price: contract.unitValue }];
    if (priceTimeframe === '1W') return baseHistory.slice(-2);
    if (priceTimeframe === '1M') return baseHistory.slice(-4);
    return baseHistory;
  }, [priceTimeframe, contract.unitValue]);

  const contractSentiment = useMemo(() => {
    if (contract.growth > 10) return { label: t('BULLISH', 'HAUSSIER'), color: 'text-emerald-400', value: 88 };
    if (contract.growth > 0) return { label: t('NEUTRAL', 'NEUTRE'), color: 'text-primary-cyan', value: 58 };
    return { label: t('BEARISH', 'BAISSIER'), color: 'text-red-400', value: 32 };
  }, [contract.growth, t]);

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-on-surface-variant hover:text-primary-cyan hover:border-primary-cyan/50 transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-xs md:text-sm font-mono text-primary-cyan font-bold uppercase tracking-widest">{contract.registryIndex}</span>
              <div className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
                contract.rarity === 'Legendary' ? 'bg-accent-gold/20 text-accent-gold border border-accent-gold/30' :
                contract.rarity === 'Epic' ? 'bg-accent-pink/20 text-accent-pink border border-accent-pink/30' :
                contract.rarity === 'Rare' ? 'bg-primary-cyan/20 text-primary-cyan border border-primary-cyan/30' :
                'bg-white/10 text-on-surface-variant border border-white/20'
              }`}>
                {contract.rarity}
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-black font-headline tracking-tighter text-white leading-[0.9] uppercase italic">{contract.name}</h1>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={(e) => onToggleWatchlist?.(e, contract.id)}
            className={`p-3 rounded-xl border transition-all active:scale-95 ${
              isWatchlisted 
                ? 'bg-primary-cyan/10 border-primary-cyan/30 text-primary-cyan shadow-[0_0_15px_rgba(0,224,255,0.2)]' 
                : 'bg-white/5 border-white/10 text-on-surface-variant hover:text-white hover:border-white/20'
            }`}
          >
            <Star size={20} className={isWatchlisted ? 'fill-primary-cyan' : ''} />
          </button>
          <button 
            onClick={() => onTrade(contract, 'BUY')}
            className="flex-1 md:flex-none px-8 py-3 bg-primary-cyan text-surface-dim text-xs font-black uppercase tracking-[0.2em] rounded-xl hover:bg-white transition-all shadow-lg shadow-primary-cyan/20"
          >
            {t('Buy Units', 'Acheter des Unités')}
          </button>
          <button 
            onClick={() => onTrade(contract, 'SELL')}
            className="flex-1 md:flex-none px-8 py-3 bg-accent-pink text-white text-xs font-black uppercase tracking-[0.2em] rounded-xl hover:bg-white hover:text-accent-pink transition-all shadow-lg shadow-accent-pink/20"
          >
            {t('Sell Units', 'Vendre des Unités')}
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Info & Stats */}
        <div className="lg:col-span-2 space-y-8">
          {/* Hero Image & Quick Stats */}
          <div className="relative h-[400px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl group">
            <img 
              src={contract.image} 
              alt={contract.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              referrerPolicy="no-referrer" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-dim via-surface-dim/20 to-transparent" />
            
            <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-wrap gap-6 items-end justify-between">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white">
                      <Award size={24} />
                    </div>
                    <div>
                      <div className="text-[10px] text-white/50 uppercase tracking-widest font-bold">{t('Professional Rating', 'Évaluation Professionnelle')}</div>
                      <div className="text-2xl font-black text-white font-headline">{contract.professionalRating}/1000</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 border-l border-white/10 pl-6">
                    <div className="w-12 h-12 rounded-2xl bg-primary-cyan/10 backdrop-blur-xl border border-primary-cyan/20 flex items-center justify-center text-primary-cyan shadow-[0_0_20px_rgba(0,224,255,0.3)]">
                      <Zap size={24} className="animate-pulse" />
                    </div>
                    <div>
                      <div className="text-[10px] text-primary-cyan uppercase tracking-widest font-black italic">{t('Final LYA Score', 'Score LYA Final')}</div>
                      <div className="text-2xl font-black text-primary-cyan font-headline">
                        {Math.round((contract.totalScore + (contract.professionalRating || 0)) / 2)}
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-white/80 max-w-xl leading-relaxed">
                  {contract.description}
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl p-4 flex gap-8">
                <div className="text-center">
                  <div className="text-[9px] text-white/50 uppercase tracking-widest font-bold mb-1">{t('Total Value', 'Valeur Totale')}</div>
                  <div className="text-lg font-black text-white font-headline">${(contract.totalValue / 1000).toFixed(0)}K</div>
                </div>
                <div className="w-[1px] h-10 bg-white/10" />
                <div className="text-center">
                  <div className="text-[9px] text-white/50 uppercase tracking-widest font-bold mb-1">{t('Unit Price', 'Prix Unitaire')}</div>
                  <div className="text-lg font-black text-primary-cyan font-headline">${contract.unitValue}</div>
                </div>
                <div className="w-[1px] h-10 bg-white/10" />
                <div className="text-center">
                  <div className="text-[9px] text-white/50 uppercase tracking-widest font-bold mb-1">{t('Growth', 'Croissance')}</div>
                  <div className={`text-lg font-black font-headline ${contract.growth >= 0 ? 'text-emerald-400' : 'text-accent-pink'}`}>
                    {contract.growth >= 0 ? '+' : ''}{contract.growth}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="flex border-b border-white/10">
            {[
              { id: 'overview', label: t('Overview', 'Aperçu'), icon: <Activity size={16} /> },
              { id: 'financials', label: t('Financials', 'Finances'), icon: <TrendingUp size={16} /> },
              { id: 'legal', label: t('Legal & Compliance', 'Juridique & Conformité'), icon: <ShieldCheck size={16} /> },
              { id: 'milestones', label: t('Milestones', 'Jalons'), icon: <Clock size={16} /> },
              { id: 'messaging', label: t('Instant messaging', 'Messagerie Instantanée'), icon: <MessageSquare size={16} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 transition-all relative ${
                  activeTab === tab.id ? 'text-primary-cyan' : 'text-on-surface-variant hover:text-white'
                }`}
              >
                {tab.icon}
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-cyan shadow-[0_0_10px_rgba(0,224,255,0.5)]"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-surface-low/30 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary-cyan flex items-center gap-2">
                      <BarChart3 size={14} />
                      {t('Algorithm Audit Breakdown', 'Décomposition de l\'Audit Algorithmique')}
                    </h3>
                    <div className="flex flex-col items-end">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-primary-cyan drop-shadow-[0_0_15px_rgba(0,224,255,0.5)]">{Math.round((contract.totalScore + (contract.professionalRating || 0)) / 2)}</span>
                        <span className="text-[10px] text-on-surface-variant opacity-40">/1000</span>
                      </div>
                      <span className="text-[8px] text-accent-gold uppercase font-black tracking-widest animate-pulse">{t('Consolidated LYA Score', 'Score LYA Consolidé')}</span>
                    </div>
                  </div>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={pillarData} layout="vertical" margin={{ left: 0, right: 40 }}>
                        <XAxis type="number" hide domain={[0, 200]} />
                        <YAxis 
                          dataKey="name" 
                          type="category" 
                          stroke="#ffffff40" 
                          fontSize={10} 
                          tickLine={false} 
                          axisLine={false}
                          width={120}
                        />
                        <Tooltip 
                          cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                          contentStyle={{ 
                            backgroundColor: '#0A0A0A', 
                            border: '1px solid rgba(0,224,255,0.2)', 
                            borderRadius: '4px',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                            padding: '8px 12px'
                          }}
                          itemStyle={{ color: '#00E0FF', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                          labelStyle={{ display: 'none' }}
                          formatter={(value: number) => [`${value} / 200`, 'Score']}
                        />
                        <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={24} label={{ position: 'right', fill: '#ffffff', fontSize: 10, fontWeight: 'bold', offset: 10 }}>
                          {pillarData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

            <div className="bg-surface-low/30 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 space-y-6">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-accent-gold flex items-center gap-2">
                <Zap size={14} />
                {t('Market Sentiment', 'Sentiment du Marché')}
              </h3>
              <div className="flex items-center gap-4">
                <h3 className={`text-2xl font-black font-headline ${contractSentiment.color}`}>{contractSentiment.label}</h3>
                <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${contractSentiment.value}%` }}
                    className={`h-full ${contractSentiment.color.replace('text-', 'bg-')}`}
                  />
                </div>
              </div>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-widest leading-relaxed">
                {t('Based on recent growth, registry activity, and professional rating trends.', 'Basé sur la croissance récente, l\'activité du registre et les tendances d\'évaluation professionnelle.')}
              </p>
            </div>

            <div className="bg-surface-low/30 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary-cyan flex items-center gap-2">
                  <TrendingUp size={14} />
                  {t('Price History', 'Historique des Prix')}
                </h3>
                <div className="flex bg-white/5 p-1 rounded-lg border border-white/5">
                  {['1D', '1W', '1M', '1Y', 'ALL'].map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setPriceTimeframe(tf as any)}
                      className={`px-2 py-1 text-[8px] font-black rounded-md transition-all ${
                        priceTimeframe === tf ? 'bg-primary-cyan text-surface-dim' : 'text-on-surface-variant hover:text-white'
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={priceHistory}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00E0FF" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#00E0FF" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                    <XAxis dataKey="date" hide />
                    <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#0A0A0A', 
                        border: '1px solid rgba(0,224,255,0.2)', 
                        borderRadius: '4px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                        padding: '8px 12px'
                      }}
                      itemStyle={{ color: '#00E0FF', fontSize: '10px', fontWeight: 'bold' }}
                      labelStyle={{ color: '#ffffff40', fontSize: '8px', marginBottom: '4px', textTransform: 'uppercase' }}
                      formatter={(value: number) => [formatPrice(value), t('Price', 'Prix')]}
                    />
                    <Area type="monotone" dataKey="price" stroke="#00E0FF" strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-surface-low/30 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 space-y-6">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-accent-gold flex items-center gap-2">
                <Zap size={14} />
                {t('Contract Rights', 'Droits du Contrat')}
              </h3>
                  <div className="space-y-4">
                    {contract.rights.map((right, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5 group hover:border-accent-gold/30 transition-all">
                        <div className="w-8 h-8 rounded-lg bg-accent-gold/10 flex items-center justify-center text-accent-gold">
                          <ShieldCheck size={16} />
                        </div>
                        <span className="text-xs font-bold text-on-surface group-hover:text-accent-gold transition-colors">{right}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'financials' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-surface-low/30 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary-cyan flex items-center gap-2">
                        <TrendingUp size={14} />
                        {t('Historical Revenue & Projections', 'Revenus Historiques & Projections')}
                      </h3>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary-cyan rounded-full" />
                          <span className="text-[8px] font-bold text-on-surface-variant uppercase tracking-widest">{t('Actual', 'Réel')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-white/20 rounded-full" />
                          <span className="text-[8px] font-bold text-on-surface-variant uppercase tracking-widest">{t('Projected', 'Projeté')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex bg-white/5 p-1 rounded-lg border border-white/5">
                      {['1D', '1W', '1M', '1Y', 'ALL'].map((tf) => (
                        <button
                          key={tf}
                          onClick={() => setRevenueTimeframe(tf as any)}
                          className={`px-2 py-1 text-[8px] font-black rounded-md transition-all ${
                            revenueTimeframe === tf ? 'bg-primary-cyan text-surface-dim' : 'text-on-surface-variant hover:text-white'
                          }`}
                        >
                          {tf}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={revenueData}>
                        <defs>
                          <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00E0FF" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#00E0FF" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                        <XAxis dataKey="month" stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#0A0A0A', 
                            border: '1px solid rgba(0,224,255,0.2)', 
                            borderRadius: '4px',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                            padding: '8px 12px'
                          }}
                          itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                          labelStyle={{ color: '#ffffff40', fontSize: '8px', marginBottom: '4px', textTransform: 'uppercase' }}
                          formatter={(value: number, name: string) => [formatPrice(value), name === 'revenue' ? t('Actual', 'Réel') : t('Projected', 'Projeté')]}
                        />
                        <Area type="monotone" dataKey="revenue" stroke="#00E0FF" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                        <Area type="monotone" dataKey="projection" stroke="#ffffff20" strokeWidth={2} strokeDasharray="5 5" fill="transparent" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: t('Revenue Share', 'Part des Revenus'), value: `${contract.revenueSharePercentage}%`, icon: <PieChartIcon size={16} />, color: 'text-primary-cyan' },
                    { label: t('Avg. Yield (APY)', 'Rendement Moyen (APY)'), value: '12.4%', icon: <TrendingUp size={16} />, color: 'text-emerald-400' },
                    { label: t('Payout Frequency', 'Fréquence de Paiement'), value: t('Quarterly', 'Trimestriel'), icon: <Clock size={16} />, color: 'text-accent-gold' }
                  ].map((stat, i) => (
                    <div key={i} className="bg-surface-low/30 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 space-y-4">
                      <div className={`w-10 h-10 rounded-xl bg-surface-dim flex items-center justify-center ${stat.color}`}>
                        {stat.icon}
                      </div>
                      <div>
                        <div className="text-[9px] uppercase tracking-widest text-on-surface-variant font-black opacity-50 mb-1">{stat.label}</div>
                        <div className="text-xl font-black text-white font-headline">{stat.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'legal' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-surface-low/30 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary-cyan flex items-center gap-2">
                    <ShieldCheck size={14} />
                    {t('Regulatory & Compliance Framework', 'Cadre Réglementaire & Conformité')}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                        <div className="flex items-center gap-3">
                          <Globe size={16} className="text-on-surface-variant" />
                          <span className="text-xs font-bold text-on-surface">{t('Jurisdiction', 'Juridiction')}</span>
                        </div>
                        <span className="text-xs font-mono text-primary-cyan font-bold">{contract.jurisdiction}</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                        <div className="flex items-center gap-3">
                          <Lock size={16} className="text-on-surface-variant" />
                          <span className="text-xs font-bold text-on-surface">{t('Contract Type', 'Type de Contrat')}</span>
                        </div>
                        <span className="text-xs font-mono text-white font-bold">{contract.contractType}</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                        <div className="flex items-center gap-3">
                          <Award size={16} className="text-on-surface-variant" />
                          <span className="text-xs font-bold text-on-surface">{t('Validator', 'Validateur')}</span>
                        </div>
                        <span className="text-xs font-mono text-accent-gold font-bold">{contract.professionalValidator}</span>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">{t('Registry Information', 'Informations du Registre')}</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] text-on-surface-variant/60">{t('Registry Address', 'Adresse du Registre')}</span>
                            <span className="text-[10px] font-mono text-white">{contract.registryAddress}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] text-on-surface-variant/60">{t('Last Audit', 'Dernier Audit')}</span>
                            <span className="text-[10px] font-mono text-white">{contract.lastAudit}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] text-on-surface-variant/60">{t('Maturity Date', 'Date d\'Échéance')}</span>
                            <span className="text-[10px] font-mono text-white">{contract.maturityDate}</span>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => onNotify('DOWNLOADING LEGAL PROSPECTUS...')}
                        className="w-full py-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
                      >
                        <Download size={14} className="text-primary-cyan" />
                        {t('Download Legal Prospectus', 'Télécharger le Prospectus Juridique')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'milestones' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-surface-low/30 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 space-y-8">
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary-cyan flex items-center gap-2">
                    <Clock size={14} />
                    {t('Project Roadmap & Milestones', 'Feuille de Route & Jalons du Projet')}
                  </h3>
                  <div className="relative space-y-12 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-white/5">
                    {contract.milestones.map((milestone, i) => (
                      <div key={i} className="relative pl-12 group">
                        <div className={`absolute left-0 top-1 w-10 h-10 rounded-full border-4 border-surface-dim flex items-center justify-center z-10 transition-all ${
                          milestone.status === 'COMPLETED' ? 'bg-emerald-400 text-surface-dim' :
                          milestone.status === 'IN_PROGRESS' ? 'bg-primary-cyan text-surface-dim animate-pulse' :
                          'bg-white/10 text-on-surface-variant'
                        }`}>
                          {milestone.status === 'COMPLETED' ? <ShieldCheck size={16} /> : <Clock size={16} />}
                        </div>
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/5 group-hover:border-white/20 transition-all">
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                              <div className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold mb-1">{milestone.date}</div>
                              <h4 className="text-lg font-black text-white uppercase tracking-tight">{milestone.label}</h4>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <div className="text-[9px] text-on-surface-variant uppercase tracking-widest font-bold mb-1">{t('Price Impact', 'Impact sur le Prix')}</div>
                                <div className="text-sm font-black text-emerald-400">+{milestone.priceImpact}%</div>
                              </div>
                              <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                milestone.status === 'COMPLETED' ? 'bg-emerald-400/20 text-emerald-400' :
                                milestone.status === 'IN_PROGRESS' ? 'bg-primary-cyan/20 text-primary-cyan' :
                                'bg-white/10 text-on-surface-variant'
                              }`}>
                                {milestone.status}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'messaging' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-surface-low/30 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 flex flex-col h-[600px]">
                  <div className="flex justify-between items-center mb-8 pb-6 border-b border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary-cyan/10 flex items-center justify-center text-primary-cyan">
                        <MessageSquare size={24} />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-white uppercase tracking-widest">{t('Institutional Channel', 'Canal Institutionnel')}</h3>
                        <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest opacity-50">{t('End-to-end Encrypted', 'Chiffré de bout en bout')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                       <div className="text-[8px] font-black text-accent-gold uppercase tracking-[0.2em] mb-1 opacity-50">{t('LYA SCORE PROTECTION', 'PROTECTION SCORE LYA')}</div>
                       <div className="flex items-baseline justify-end gap-1">
                          <span className="text-xl font-black text-white italic">{contract.totalScore}</span>
                          <span className="text-[8px] text-white/20">/1k</span>
                       </div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-6 pr-4 custom-scrollbar">
                    {chatMessages.map(msg => (
                      <div key={msg.id} className={`flex flex-col ${msg.sender === 'You' ? 'items-end' : 'items-start'}`}>
                        <div className="flex items-center gap-2 mb-2">
                           <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest">{msg.sender}</span>
                           <span className="text-[8px] font-mono text-on-surface-variant/40">{msg.time}</span>
                        </div>
                        <div className={`p-4 rounded-2xl text-sm max-w-[80%] ${
                          msg.sender === 'You' 
                            ? 'bg-primary-cyan text-surface-dim font-bold italic' 
                            : 'bg-white/5 border border-white/10 text-white italic opacity-80'
                        }`}>
                          {msg.content}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-8 border-t border-white/5">
                    <div className="relative">
                      <input 
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && message.trim()) {
                            setChatMessages([...chatMessages, { id: Date.now().toString(), sender: 'You', content: message, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
                            setMessage('');
                          }
                        }}
                        placeholder={t('Enter professional message...', 'Entrez un message professionnel...')}
                        className="w-full bg-surface-dim border border-white/10 rounded-xl py-5 pl-6 pr-16 text-xs font-medium focus:border-primary-cyan/50 focus:ring-0 outline-none transition-all placeholder:text-on-surface-variant/20 italic"
                      />
                      <button 
                        onClick={() => {
                          if (message.trim()) {
                            setChatMessages([...chatMessages, { id: Date.now().toString(), sender: 'You', content: message, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
                            setMessage('');
                          }
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-primary-cyan hover:text-white transition-colors"
                      >
                        <Send size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Market Data & Actions */}
        <div className="space-y-8">
          {/* Market Status */}
          <div className="bg-surface-low/30 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary-cyan flex items-center gap-2">
              <Globe size={14} />
              {t('Market Status', 'Statut du Marché')}
            </h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-xs text-on-surface-variant uppercase tracking-widest font-bold">{t('Status', 'Statut')}</span>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${contract.status === 'LIVE' ? 'bg-emerald-400 animate-pulse' : 'bg-accent-pink'}`} />
                  <span className={`text-xs font-black uppercase tracking-widest ${contract.status === 'LIVE' ? 'text-emerald-400' : 'text-accent-pink'}`}>
                    {contract.status}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-on-surface-variant uppercase tracking-widest font-bold">{t('Unit Price', 'Prix Unitaire')}</span>
                <span className="text-xs font-black text-white uppercase tracking-widest">{formatPrice(contract.unitValue)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-on-surface-variant uppercase tracking-widest font-bold">{t('Available Units', 'Unités Disponibles')}</span>
                <div className="text-right">
                  <span className="text-xs font-black text-white uppercase tracking-widest">{contract.availableUnits?.toLocaleString()} / {contract.totalUnits.toLocaleString()}</span>
                  <div className="text-[10px] text-accent-gold font-bold">{formatPrice((contract.availableUnits || 0) * contract.unitValue)}</div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-on-surface-variant uppercase tracking-widest font-bold">{t('Liquidity', 'Liquidité')}</span>
                <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">HIGH</span>
              </div>
              <div className="pt-6 border-t border-white/5">
                <div className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold mb-4">{t('Price Stability', 'Stabilité du Prix')}</div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${contract.stability * 100}%` }}
                    className="h-full bg-primary-cyan shadow-[0_0_10px_rgba(0,224,255,0.5)]"
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-[9px] text-on-surface-variant uppercase font-bold">{t('Volatile', 'Volatile')}</span>
                  <span className="text-[9px] text-on-surface-variant uppercase font-bold">{t('Stable', 'Stable')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Issuer Info */}
          <div className="bg-surface-low/30 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-accent-gold flex items-center gap-2">
              <Award size={14} />
              {t('Issuer Identity', 'Identité de l\'Émetteur')}
            </h3>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-surface-dim border border-white/10 flex items-center justify-center text-accent-gold">
                <FileText size={24} />
              </div>
              <div>
                <div className="text-sm font-black text-white uppercase tracking-tight">{contract.issuerId}</div>
                <div className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">{t('Verified Creator', 'Créateur Vérifié')}</div>
              </div>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-3">
              <div className="flex justify-between text-[10px]">
                <span className="text-on-surface-variant/60 uppercase font-bold">{t('Total Issued', 'Total Émis')}</span>
                <span className="text-white font-bold">12 {t('Contracts', 'Contrats')}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-on-surface-variant/60 uppercase font-bold">{t('Avg. Performance', 'Performance Moy.')}</span>
                <span className="text-emerald-400 font-bold">+24.8%</span>
              </div>
            </div>
            <button 
              onClick={() => onNotify('OPENING ISSUER PROFILE...')}
              className="w-full py-3 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant hover:text-primary-cyan transition-colors flex items-center justify-center gap-2"
            >
              {t('View Issuer Profile', 'Voir le Profil de l\'Émetteur')} <ChevronRight size={14} />
            </button>
          </div>

          {/* Institutional Actions */}
          <div className="bg-primary-cyan/5 border border-primary-cyan/20 rounded-2xl p-8 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary-cyan flex items-center gap-2">
              <Lock size={14} />
              {t('Institutional Tools', 'Outils Institutionnels')}
            </h3>
            <div className="space-y-3">
              <button 
                onClick={() => onNotify('EXPORTING TRADE HISTORY...')}
                className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
              >
                <Download size={14} />
                {t('Export Trade History', 'Exporter l\'Historique')}
              </button>
              <button 
                onClick={() => onNotify('OPENING REGISTRY EXPLORER...')}
                className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
              >
                <ExternalLink size={14} />
                {t('View on Registry', 'Voir sur le Registre')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

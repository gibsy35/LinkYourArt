
import React from 'react';
import { motion } from 'motion/react';
import { Zap, ArrowUpRight, ArrowDownRight, Activity, BarChart3, ShieldCheck, RefreshCw, Layers } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';

export const SecondaryMarket: React.FC = () => {
  const { t } = useTranslation();

  const liquidityData = [
    { price: '49.95', amount: 120, type: 'bid' },
    { price: '49.92', amount: 450, type: 'bid' },
    { price: '49.88', amount: 890, type: 'bid' },
    { price: '49.85', amount: 1200, type: 'bid' },
    { price: '50.05', amount: 150, type: 'ask' },
    { price: '50.08', amount: 320, type: 'ask' },
    { price: '50.12', amount: 780, type: 'ask' },
    { price: '50.15', amount: 1100, type: 'ask' },
  ];

  const volumeData = [
    { time: '08:00', volume: 2100, cumulative: 2100 },
    { time: '09:00', volume: 4500, cumulative: 6600 },
    { time: '10:00', volume: 5200, cumulative: 11800 },
    { time: '11:00', volume: 4800, cumulative: 16600 },
    { time: '12:00', volume: 6100, cumulative: 22700 },
    { time: '13:00', volume: 5900, cumulative: 28600 },
    { time: '14:00', volume: 7200, cumulative: 35800 },
    { time: '15:00', volume: 6800, cumulative: 42600 },
    { time: '16:00', volume: 8400, cumulative: 51000 },
    { time: '17:00', volume: 7900, cumulative: 58900 },
    { time: '18:00', volume: 9200, cumulative: 68100 },
  ];

  const depthData = [
    { price: 49.80, bids: 5000, asks: 0 },
    { price: 49.85, bids: 4200, asks: 0 },
    { price: 49.90, bids: 3500, asks: 0 },
    { price: 49.95, bids: 2800, asks: 0 },
    { price: 50.00, bids: 0, asks: 0 },
    { price: 50.05, bids: 0, asks: 2500 },
    { price: 50.10, bids: 0, asks: 3200 },
    { price: 50.15, bids: 0, asks: 4100 },
    { price: 50.20, bids: 0, asks: 5500 },
  ];

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Book / Liquidity Depth */}
        <div className="lg:col-span-1 bg-surface-low/30 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary-cyan flex items-center gap-2">
              <Layers size={14} />
              {t('Order Book Depth', 'Profondeur du Carnet d\'Ordres')}
            </h3>
            <div className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-[9px] text-emerald-400 font-black uppercase tracking-widest">
              {t('Live', 'En Direct')}
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-3 text-[9px] uppercase tracking-widest text-on-surface-variant font-black opacity-40 pb-2 border-b border-white/5">
              <span>{t('Price (USD)', 'Prix (USD)')}</span>
              <span className="text-center">{t('Amount (LYA)', 'Montant (LYA)')}</span>
              <span className="text-right">{t('Total', 'Total')}</span>
            </div>

            {/* Asks (Sellers) */}
            <div className="space-y-1">
              {liquidityData.filter(d => d.type === 'ask').reverse().map((order, i) => (
                <div key={`ask-${i}`} className="grid grid-cols-3 text-[10px] font-mono py-1 relative group">
                  <div className="absolute inset-y-0 right-0 bg-accent-pink/5 transition-all" style={{ width: `${(order.amount / 1200) * 100}%` }} />
                  <span className="text-accent-pink font-bold relative z-10">{order.price}</span>
                  <span className="text-center text-white relative z-10">{order.amount}</span>
                  <span className="text-right text-on-surface-variant/60 relative z-10">{(parseFloat(order.price) * order.amount).toFixed(0)}</span>
                </div>
              ))}
            </div>

            {/* Current Price */}
            <div className="py-4 border-y border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black text-white font-headline">50.00</span>
                <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">USD / LYA</span>
              </div>
              <div className="flex items-center gap-1 text-emerald-400">
                <ArrowUpRight size={14} />
                <span className="text-xs font-black">+0.05%</span>
              </div>
            </div>

            {/* Bids (Buyers) */}
            <div className="space-y-1">
              {liquidityData.filter(d => d.type === 'bid').map((order, i) => (
                <div key={`bid-${i}`} className="grid grid-cols-3 text-[10px] font-mono py-1 relative group">
                  <div className="absolute inset-y-0 right-0 bg-emerald-500/5 transition-all" style={{ width: `${(order.amount / 1200) * 100}%` }} />
                  <span className="text-emerald-400 font-bold relative z-10">{order.price}</span>
                  <span className="text-center text-white relative z-10">{order.amount}</span>
                  <span className="text-right text-on-surface-variant/60 relative z-10">{(parseFloat(order.price) * order.amount).toFixed(0)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Market Efficiency & Liquidity Optimization */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-surface-low/30 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Zap size={100} className="text-primary-cyan" />
            </div>
            
            <div className="relative z-10 space-y-8">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary-cyan flex items-center gap-2">
                    <Activity size={14} />
                    {t('Secondary Market Efficiency', 'Efficience du Marché Secondaire')}
                  </h3>
                  <h4 className="text-3xl font-black font-headline uppercase tracking-tighter text-white">
                    {t('Liquidity Optimization Protocol', 'Protocole d\'Optimisation de la Liquidité')}
                  </h4>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1 opacity-40">{t('Market Health', 'Santé du Marché')}</div>
                  <div className="text-2xl font-black text-primary-cyan font-headline">OPTIMAL</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: t('Avg. Spread', 'Spread Moyen'), value: '0.02%', icon: <BarChart3 size={16} />, color: 'text-primary-cyan' },
                  { label: t('Slippage (10k LYA)', 'Glissement (10k LYA)'), value: '< 0.05%', icon: <Zap size={16} />, color: 'text-accent-gold' },
                  { label: t('Institutional Depth', 'Profondeur Institutionnelle'), value: '$45.2M', icon: <ShieldCheck size={16} />, color: 'text-emerald-400' }
                ].map((stat, i) => (
                  <div key={i} className="bg-white/5 p-5 rounded-xl border border-white/5 space-y-3">
                    <div className={`w-8 h-8 rounded-lg bg-surface-dim flex items-center justify-center ${stat.color}`}>
                      {stat.icon}
                    </div>
                    <div>
                      <div className="text-[9px] uppercase tracking-widest text-on-surface-variant font-black opacity-50 mb-1">{stat.label}</div>
                      <div className="text-xl font-black text-white font-headline">{stat.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={volumeData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00E0FF" stopOpacity={0.8}/>
                        <stop offset="100%" stopColor="#00E0FF" stopOpacity={0.2}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                    <XAxis 
                      dataKey="time" 
                      stroke="#ffffff20" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false}
                      tick={{ fill: '#ffffff40', fontWeight: 'bold' }}
                    />
                    <YAxis hide />
                    <Tooltip 
                      cursor={{ fill: 'rgba(0,224,255,0.05)' }}
                      contentStyle={{ 
                        backgroundColor: '#0A0A0A', 
                        border: '1px solid rgba(0,224,255,0.4)', 
                        borderRadius: '8px',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
                        padding: '12px 16px'
                      }}
                      itemStyle={{ color: '#00E0FF', fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                      labelStyle={{ color: '#ffffff60', fontSize: '10px', marginBottom: '6px', textTransform: 'uppercase', fontWeight: 'bold' }}
                      formatter={(value: number) => [`${value.toLocaleString()} LYA`, t('Volume', 'Volume')]}
                    />
                    <Bar dataKey="volume" radius={[4, 4, 0, 0]}>
                      {volumeData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill="url(#barGradient)"
                          stroke="#00E0FF"
                          strokeWidth={index === volumeData.length - 1 ? 2 : 0}
                          opacity={index === volumeData.length - 1 ? 1 : 0.6}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="pt-8 border-t border-white/5">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant opacity-60">
                    {t('Market Depth Analysis', 'Analyse de la Profondeur du Marché')}
                  </h4>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">{t('Bids', 'Offres')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent-pink" />
                      <span className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">{t('Asks', 'Demandes')}</span>
                    </div>
                  </div>
                </div>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={depthData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorBids" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorAsks" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ff4d8d" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#ff4d8d" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="price" 
                        stroke="#ffffff10" 
                        fontSize={9} 
                        tickLine={false} 
                        axisLine={false}
                        tick={{ fill: '#ffffff30' }}
                        tickFormatter={(val) => val.toFixed(2)}
                      />
                      <YAxis hide />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px' }}
                        itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                        labelStyle={{ fontSize: '9px', opacity: 0.5, marginBottom: '4px' }}
                      />
                      <Area type="stepAfter" dataKey="bids" stroke="#10b981" fillOpacity={1} fill="url(#colorBids)" />
                      <Area type="stepAfter" dataKey="asks" stroke="#ff4d8d" fillOpacity={1} fill="url(#colorAsks)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Institutional Compliance & Verification */}
          <div className="bg-surface-low/30 backdrop-blur-2xl border border-white/10 rounded-2xl p-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-primary-cyan/10 rounded-2xl flex items-center justify-center text-primary-cyan border border-primary-cyan/20">
                  <RefreshCw size={32} className="animate-spin-slow" />
                </div>
                <div>
                  <h4 className="text-lg font-black font-headline uppercase tracking-tight text-white">
                    {t('Real-Time Registry Verification', 'Vérification du Registre en Temps Réel')}
                  </h4>
                  <p className="text-xs text-on-surface-variant opacity-60 mt-1">
                    {t('Automated institutional compliance audit active across all 128 registries.', 'Audit de conformité institutionnelle automatisé actif sur les 128 registres.')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right hidden md:block">
                  <div className="text-[9px] uppercase tracking-widest text-on-surface-variant font-black opacity-40 mb-1">{t('Last Verification', 'Dernière Vérification')}</div>
                  <div className="text-xs font-mono text-white">0.4s {t('ago', 'il y a')}</div>
                </div>
                <button className="px-6 py-3 bg-primary-cyan text-surface-dim text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-white transition-colors shadow-lg shadow-primary-cyan/20">
                  {t('View Audit Log', 'Voir le Journal d\'Audit')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

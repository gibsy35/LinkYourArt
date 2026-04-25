
import React from 'react';
import { motion } from 'motion/react';
import { Shield, Zap, Globe, BarChart3, Layers, Cpu, TrendingUp, Sparkles, Activity, ArrowUpRight } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface Pillar {
  label: string;
  desc: string;
  score: number;
  color: string;
  icon: React.ElementType;
}

export const LYA_PILLARS: Pillar[] = [
  { label: 'Project Quality', desc: 'Aesthetic excellence and conceptual depth.', score: 200, color: 'bg-primary-cyan', icon: Layers },
  { label: 'Marketability', desc: 'Commercial viability and audience resonance.', score: 200, color: 'bg-accent-pink', icon: BarChart3 },
  { label: 'Legal Security', desc: 'Contractual robustness and IP protection.', score: 200, color: 'bg-accent-green', icon: Shield },
  { label: 'Technical Innovation', desc: 'Pioneering use of creative technology.', score: 200, color: 'bg-accent-purple', icon: Cpu },
  { label: 'Growth Potential', desc: 'Scalability and long-term value appreciation.', score: 200, color: 'bg-accent-gold', icon: Zap }
];

export const LYAAlgorithm: React.FC<{ className?: string }> = ({ className }) => {
  const { t } = useTranslation();

  const PILLARS: Pillar[] = [
    { label: t('Project Quality', 'Qualité du Projet'), desc: t('Aesthetic excellence and conceptual depth.', 'Excellence esthétique et profondeur conceptuelle.'), score: 200, color: 'bg-primary-cyan', icon: Layers },
    { label: t('Marketability', 'Potentiel Commercial'), desc: t('Commercial viability and audience resonance.', 'Viabilité commerciale et résonance auprès du public.'), score: 200, color: 'bg-accent-pink', icon: BarChart3 },
    { label: t('Legal Security', 'Sécurité Juridique'), desc: t('Contractual robustness and IP protection.', 'Robustesse contractuelle et protection de la PI.'), score: 200, color: 'bg-accent-green', icon: Shield },
    { label: t('Technical Innovation', 'Innovation Technique'), desc: t('Pioneering use of creative technology.', 'Utilisation pionnière des technologies créatives.'), score: 200, color: 'bg-accent-purple', icon: Cpu },
    { label: t('Growth Potential', 'Potentiel de Croissance'), desc: t('Scalability and long-term value appreciation.', 'Évolutivité et appréciation de la valeur à long terme.'), score: 200, color: 'bg-accent-gold', icon: Zap }
  ];

  const predictiveData = [
    { month: 'Jan', yield: 100, projected: 100, capacity: 100 },
    { month: 'Feb', yield: 112, projected: 115, capacity: 105 },
    { month: 'Mar', yield: 125, projected: 130, capacity: 115 },
    { month: 'Apr', yield: 138, projected: 145, capacity: 128 },
    { month: 'May', yield: null, projected: 165, capacity: 145 },
    { month: 'Jun', yield: null, projected: 185, capacity: 168 },
    { month: 'Jul', yield: null, projected: 210, capacity: 195 },
    { month: 'Aug', yield: null, projected: 245, capacity: 230 },
  ];

  return (
    <div className={`space-y-16 ${className}`}>
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-6">
          <div className="px-4 py-1 bg-primary-cyan/10 border border-primary-cyan/30 text-[10px] font-black uppercase tracking-[0.4em] text-primary-cyan rounded-full flex items-center gap-2">
            <Sparkles size={12} />
            {t('Institutional Intelligence', 'Intelligence Institutionnelle')}
          </div>
        </div>
        <h2 className="text-4xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">
          The <span className="text-primary-cyan">LYA</span> Algorithm
        </h2>
        <p className="text-on-surface-variant text-lg max-w-2xl mx-auto opacity-70 font-serif italic">
          {t('Our proprietary indexing engine transcribes creative potential into institutional-grade contract yield through a multi-dimensional audit protocol.', 'Notre moteur d\'indexation exclusif transcrit le potentiel créatif en rendement de contrats de qualité institutionnelle via un protocole d\'audit multidimensionnel.')}
        </p>
      </div>

      <div className="grid md:grid-cols-5 gap-4">
        {PILLARS.map((pillar, i) => (
          <motion.div
            key={pillar.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group relative p-8 bg-surface-low border border-white/5 hover:border-primary-cyan/30 transition-all overflow-hidden rounded-sm"
          >
            <div className={`absolute top-0 left-0 w-full h-0.5 ${pillar.color} opacity-30 group-hover:opacity-100 transition-opacity`} />
            <pillar.icon className="w-10 h-10 text-on-surface-variant mb-8 group-hover:text-primary-cyan transition-colors" strokeWidth={1.5} />
            <h4 className="text-xs font-black uppercase tracking-widest text-white mb-3">{pillar.label}</h4>
            <p className="text-[10px] text-on-surface-variant leading-relaxed opacity-60 mb-8 font-bold tracking-tighter uppercase">{pillar.desc}</p>
            <div className="flex justify-between items-end">
              <span className="text-[9px] font-mono text-on-surface-variant/40 uppercase tracking-widest">{t('Weight', 'Poids')}</span>
              <span className="text-sm font-mono font-bold text-white">200 PTS</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Predictive Yield Engine */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-surface-low border border-white/5 p-10 relative overflow-hidden rounded-sm">
          <div className="absolute top-0 right-0 p-10 opacity-5">
            <TrendingUp size={120} className="text-primary-cyan" />
          </div>
          
          <div className="relative z-10 space-y-10">
            <div className="flex justify-between items-end">
              <div className="space-y-2">
                <h3 className="text-[10px] uppercase tracking-[0.5em] text-primary-cyan font-black flex items-center gap-3">
                  <Activity size={14} />
                  {t('Predictive Yield Engine', 'Moteur de Rendement Prédictif')}
                </h3>
                <h4 className="text-3xl font-black font-headline uppercase tracking-tighter text-white">
                  {t('Yield Projection v4.0', 'Projection de Rendement v4.0')}
                </h4>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1 opacity-40">{t('Est. Annual ROI', 'ROI Annuel Est.')}</div>
                <div className="text-4xl font-black text-emerald-400 font-headline">+24.8%</div>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={predictiveData}>
                  <defs>
                    <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00E0FF" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00E0FF" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    stroke="#ffffff20" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    tick={{ fill: '#ffffff40', fontWeight: 'bold' }}
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #ffffff10', borderRadius: '4px' }}
                    itemStyle={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="yield" 
                    stroke="#00E0FF" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorYield)" 
                    name="Actual Yield"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="projected" 
                    stroke="#D4AF37" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    fillOpacity={1} 
                    fill="url(#colorProjected)" 
                    name="Projected Yield"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="capacity" 
                    stroke="#A855F7" 
                    strokeWidth={2}
                    strokeDasharray="3 3"
                    fillOpacity={0} 
                    name="Yield Capacity"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/5">
              {[
                { label: t('Confidence Interval', 'Intervalle de Confiance'), value: '94.2%', icon: <Shield size={12} /> },
                { label: t('Market Volatility', 'Volatilité du Marché'), value: 'Low', icon: <Activity size={12} /> },
                { label: t('Liquidity Index', 'Indice de Liquidité'), value: 'High', icon: <Zap size={12} /> }
              ].map(item => (
                <div key={item.label} className="space-y-1">
                  <div className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold opacity-40 flex items-center gap-2">
                    {item.icon}
                    {item.label}
                  </div>
                  <div className="text-lg font-black text-white font-headline">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-surface-low border border-white/5 p-10 flex flex-col justify-between rounded-sm">
          <div className="space-y-6">
            <h3 className="text-[10px] uppercase tracking-[0.5em] text-accent-purple font-black">
              {t('Risk Assessment', 'Évaluation des Risques')}
            </h3>
            <div className="space-y-8">
              {[
                { label: 'Regulatory Risk', score: 12, color: 'bg-emerald-400' },
                { label: 'Market Saturation', score: 45, color: 'bg-accent-gold' },
                { label: 'IP Infringement', score: 8, color: 'bg-emerald-400' },
                { label: 'Execution Risk', score: 22, color: 'bg-primary-cyan' }
              ].map(risk => (
                <div key={risk.label} className="space-y-2">
                  <div className="flex justify-between text-[10px] uppercase tracking-widest font-black">
                    <span className="text-on-surface-variant">{risk.label}</span>
                    <span className="text-white">{risk.score}%</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${risk.score}%` }}
                      className={`h-full ${risk.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-10">
            <div className="p-6 bg-accent-purple/5 border border-accent-purple/20 rounded-sm">
              <p className="text-[10px] text-accent-purple font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                <ArrowUpRight size={14} />
                {t('Predictive Insight', 'Aperçu Prédictif')}
              </p>
              <p className="text-xs text-on-surface-variant leading-relaxed italic opacity-80">
                "{t('Current market trends suggest a 15% increase in Digital Art valuation over the next fiscal quarter.', 'Les tendances actuelles du marché suggèrent une augmentation de 15% de la valorisation de l\'Art Numérique au cours du prochain trimestre fiscal.')}"
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-16 bg-surface-dim border border-white/5 relative overflow-hidden text-center rounded-sm">
        <div className="absolute inset-0 bg-primary-cyan/5 blur-3xl animate-pulse" />
        <div className="relative z-10 flex flex-col items-center gap-8">
          <div className="text-[10px] font-mono text-on-surface-variant uppercase tracking-[0.5em] font-black">{t('Aggregate Index Capacity', 'Capacité d\'Indice Agrégée')}</div>
          <div className="text-7xl md:text-9xl font-black italic tracking-tighter text-white drop-shadow-[0_0_50px_rgba(255,255,255,0.15)]">
            1000<span className="text-primary-cyan">/1000</span>
          </div>
          <div className="max-w-2xl text-base text-on-surface-variant opacity-60 italic font-serif leading-relaxed">
            "{t("The LYA Score represents the definitive index of a creative contract's living value, updated in real-time through market feedback and periodic institutional audits.", "Le Score LYA représente l'indice définitif de la valeur vivante d'un contrat créatif, mis à jour en temps réel via les retours du marché et des audits institutionnels périodiques.")}"
          </div>
        </div>
      </div>
    </div>
  );
};

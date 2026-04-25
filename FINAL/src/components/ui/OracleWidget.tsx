
import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, MessageSquare, ArrowRight } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';

interface OracleWidgetProps {
  onAction?: () => void;
}

export const OracleWidget: React.FC<OracleWidgetProps> = ({ onAction }) => {
  const { t } = useTranslation();

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed bottom-32 right-12 z-50 w-80"
    >
      <div className="relative group">
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-accent-magenta via-accent-purple to-primary-cyan rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-pulse" />
        
        <div className="relative bg-surface-dim border border-white/10 rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-accent-magenta/10 flex items-center justify-center text-accent-magenta">
              <Sparkles size={20} className="animate-pulse" />
            </div>
            <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] italic">
              {t('IA PROPHÈTE CULTUREL', 'IA PROPHÈTE CULTUREL')}
            </h3>
          </div>

          <div className="space-y-4 mb-6">
            <p className="text-[11px] text-on-surface-variant leading-relaxed font-medium italic border-l-2 border-accent-magenta pl-4">
              "{t('Strategic Signal: High momentum detected in the \'Neo-Minimalism\' sector. Projected asset value increase: +18% in Q3.', 'Signal Stratégique : Momentum élevé détecté dans le secteur \'Néo-Minimalisme\'. Augmentation projetée de la valeur des actifs : +18% au T3.')}"
            </p>
          </div>

          <button 
            onClick={onAction}
            className="w-full py-4 bg-accent-magenta text-white text-[10px] font-black uppercase italic tracking-[0.3em] rounded-xl hover:bg-white hover:text-surface-dim transition-all flex items-center justify-center gap-3 group/btn"
          >
            <span>{t('CONSULTER L\'INSIGHT HUB', 'CONSULTER L\'INSIGHT HUB')}</span>
            <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
          </button>
          
          <div className="mt-4 text-[7px] text-on-surface-variant font-bold uppercase tracking-widest opacity-40 text-center">
            {t('NOT FINANCIAL ADVICE • CULTURAL TREND ANALYSIS ONLY', 'PAS UN CONSEIL FINANCIER • ANALYSE DE TENDANCE CULTURELLE UNIQUEMENT')}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

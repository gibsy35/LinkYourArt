
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Zap, ShieldCheck, ChevronRight, Info } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { FeatureShowcaseModal } from './Modals';

interface LockedOverlayProps {
  title?: string;
  description?: string;
  onUpgrade?: () => void;
  featureId?: 'CREATOR' | 'INVESTOR' | 'PRO' | 'INSTITUTIONAL_AUDIT' | 'LIQUIDITY_POOL' | 'PREDICTIVE_SCORE';
}

export const LockedOverlay: React.FC<LockedOverlayProps> = ({ 
  title, 
  description,
  onUpgrade,
  featureId = 'PRO'
}) => {
  const { t } = useTranslation();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showShowcase, setShowShowcase] = useState(false);

  if (isUnlocked) return null;

  return (
    <>
      <AnimatePresence>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 flex items-center justify-center p-8 bg-black/70 backdrop-blur-2xl rounded-2xl border border-white/10 group overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary-cyan/10 to-transparent opacity-30 group-hover:opacity-50 transition-opacity duration-700" />
          
          {/* Animated Background Grid */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:20px_20px]" />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="text-center space-y-8 relative z-10 max-w-md"
          >
            <div className="relative inline-block">
              <div className="w-20 h-20 bg-primary-cyan/10 border border-primary-cyan/30 rounded-3xl flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(0,224,255,0.2)] relative z-10">
                <Lock className="text-primary-cyan" size={32} />
              </div>
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 bg-primary-cyan/20 rounded-3xl blur-2xl -z-10" 
              />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white">
                {title || t('Institutional Access Required', 'Accès Institutionnel Requis')}
              </h3>
              <p className="text-xs text-on-surface-variant font-bold uppercase tracking-[0.2em] leading-relaxed opacity-70 max-w-xs mx-auto">
                {description || t('This advanced feature is reserved for professional and institutional members of the LinkYourArt network.', 'Cette fonctionnalité avancée est réservée aux membres professionnels et institutionnels du réseau LinkYourArt.')}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <button 
                onClick={onUpgrade}
                className="px-10 py-4 bg-white text-black text-[11px] font-black uppercase tracking-[0.3em] rounded-xl hover:bg-primary-cyan transition-all flex items-center justify-center gap-4 group/btn shadow-[0_0_30px_rgba(255,255,255,0.1)]"
              >
                <Zap size={16} className="fill-current" />
                {t('Upgrade to Pro', 'Passer en Pro')}
                <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>

              <button 
                onClick={() => setShowShowcase(true)}
                className="px-10 py-4 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-4 group/btn"
              >
                <Info size={16} />
                {t('Learn More', 'En savoir plus')}
              </button>

              <button 
                onClick={() => setIsUnlocked(true)}
                className="px-10 py-4 bg-primary-cyan/10 border border-primary-cyan/30 text-primary-cyan text-[10px] font-black uppercase tracking-[0.3em] rounded-xl hover:bg-primary-cyan/20 transition-all flex items-center justify-center gap-4 group/btn"
              >
                <ShieldCheck size={16} />
                {t('Testing Phase: Unlock for Free', 'Phase de Test : Débloquer Gratuitement')}
              </button>
            </div>

            <div className="pt-6 border-t border-white/5">
              <p className="text-[9px] text-on-surface-variant/40 font-bold uppercase tracking-[0.3em]">
                LYA_PROTOCOL_V2.5_SECURED
              </p>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <FeatureShowcaseModal 
        isOpen={showShowcase} 
        onClose={() => setShowShowcase(false)} 
        featureId={featureId} 
      />
    </>
  );
};

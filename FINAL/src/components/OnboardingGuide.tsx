
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  Zap, 
  Globe, 
  Activity, 
  RefreshCw, 
  Target, 
  Scale, 
  Cpu, 
  Database, 
  Shield, 
  Award, 
  X, 
  BookOpen,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { Logo } from './ui/Logo';

export const OnboardingGuide: React.FC = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(() => {
    const dismissed = localStorage.getItem('lya_onboarding_dismissed');
    return dismissed !== 'true';
  });
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isVisible]);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('lya_onboarding_dismissed', 'true');
  };

  const colorMap: Record<string, { text: string, bg: string, border: string, bgStrong: string, glow: string }> = {
    'primary-cyan': { 
      text: 'text-primary-cyan', 
      bg: 'bg-primary-cyan/10', 
      border: 'border-primary-cyan/20',
      bgStrong: 'bg-primary-cyan',
      glow: 'rgba(0, 224, 255, 0.1)'
    },
    'emerald-400': { 
      text: 'text-emerald-400', 
      bg: 'bg-emerald-400/10', 
      border: 'border-emerald-400/20',
      bgStrong: 'bg-emerald-400',
      glow: 'rgba(52, 211, 153, 0.1)'
    },
    'accent-gold': { 
      text: 'text-accent-gold', 
      bg: 'bg-accent-gold/10', 
      border: 'border-accent-gold/20',
      bgStrong: 'bg-accent-gold',
      glow: 'rgba(238, 192, 94, 0.1)'
    },
    'accent-pink': { 
      text: 'text-accent-pink', 
      bg: 'bg-accent-pink/10', 
      border: 'border-accent-pink/20',
      bgStrong: 'bg-accent-pink',
      glow: 'rgba(255, 51, 102, 0.1)'
    },
    'accent-purple': { 
      text: 'text-accent-purple', 
      bg: 'bg-accent-purple/10', 
      border: 'border-accent-purple/20',
      bgStrong: 'bg-accent-purple',
      glow: 'rgba(128, 0, 128, 0.1)'
    }
  };

  const steps = [
    {
      icon: <Layers className="text-primary-cyan" size={48} />,
      title: t('1. Asset Indexing', '1. Indexation d\'Actifs'),
      desc: t('Creators submit projects for institutional audit and LYA Score calculation. This is where creative equity begins its journey into the financial ecosystem.', 'Les créateurs soumettent des projets pour un audit institutionnel et le calcul du score LYA. C\'est ici que l\'équité créative commence son voyage dans l\'écosystème financier.'),
      color: 'primary-cyan'
    },
    {
      icon: <ShieldCheck className="text-emerald-400" size={48} />,
      title: t('2. Legal Validation', '2. Validation Juridique'),
      desc: t('Our protocol verifies IP rights and contractual robustness across jurisdictions. We ensure every unit is backed by solid legal frameworks.', 'Notre protocole vérifie les droits de PI et la robustesse contractuelle à travers les juridictions. Nous garantissons que chaque unité est soutenue par des cadres juridiques solides.'),
      color: 'emerald-400'
    },
    {
      icon: <Zap className="text-accent-gold" size={48} />,
      title: t('3. Unit Issuance', '3. Émission d\'Unités'),
      desc: t('Contracts are divided into tradable LYA Units. This fractionalization allows for unprecedented liquidity in the creative market.', 'Les contrats sont divisés en Unités LYA échangeables. Cette fractionnalisation permet une liquidité sans précédent sur le marché créatif.'),
      color: 'accent-gold'
    },
    {
      icon: <Globe className="text-primary-cyan" size={48} />,
      title: t('4. Global Registry', '4. Registre Mondial'),
      desc: t('Assets are listed on the LYA Institutional Registry. Global visibility meets institutional transparency for every creative asset.', 'Les actifs sont inscrits sur le registre institutionnel LYA. La visibilité mondiale rencontre la transparence institutionnelle pour chaque actif créatif.'),
      color: 'primary-cyan'
    },
    {
      icon: <Activity className="text-accent-pink" size={48} />,
      title: t('5. Real-time Yield', '5. Rendement Temps Réel'),
      desc: t('Track performance and revenue shares through our live indexing engine. Watch your creative equity grow in real-time.', 'Suivez la performance et les parts de revenus via notre moteur d\'indexation en direct. Regardez votre équité créative croître en temps réel.'),
      color: 'accent-pink'
    },
    {
      icon: <RefreshCw className="text-accent-purple" size={48} />,
      title: t('6. P2P Exchange', '6. Échange P2P'),
      desc: t('Trade units 24/7 on the secondary market. Institutional liquidity at your fingertips, powered by atomic settlement.', 'Échangez des unités 24/7 sur le marché secondaire. Une liquidité institutionnelle à portée de main, propulsée par un règlement atomique.'),
      color: 'accent-purple'
    }
  ];

  if (!isVisible) return null;

  const step = steps[currentStep];
  const colors = colorMap[step.color] || colorMap['primary-cyan'];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-surface-low border border-primary-cyan/20 relative overflow-hidden group mb-12 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
    >
      <div 
        className="absolute top-0 right-0 w-96 h-96 rounded-full -mr-48 -mt-48 blur-[100px] transition-colors duration-700 opacity-20" 
        style={{ backgroundColor: colors.glow.replace('0.1', '0.5') }}
      />
      
      <button 
        onClick={handleDismiss}
        className="absolute top-6 right-6 text-on-surface-variant/40 hover:text-on-surface transition-colors z-20"
      >
        <X size={20} />
      </button>

      <div className="flex flex-col lg:flex-row min-h-[400px]">
        {/* Left: Visual/Icon */}
        <div className="lg:w-1/3 bg-white/[0.02] lg:border-r border-b lg:border-b-0 border-white/5 flex flex-col items-center justify-center p-12 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center opacity-5">
            <Logo size={300} color="multi" />
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 1.5, rotate: 20 }}
              className="relative z-10"
            >
              <div 
                className={`w-32 h-32 rounded-3xl ${colors.bg} border ${colors.border.replace('/20', '/30')} flex items-center justify-center shadow-[0_0_50px_rgba(0,224,255,0.1)]`}
                style={{ boxShadow: `0 0 50px ${colors.glow}` }}
              >
                {step.icon}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex gap-2">
            {steps.map((_, i) => (
              <div 
                key={i}
                className={`h-1 rounded-full transition-all duration-500 ${i === currentStep ? `w-8 ${colors.bgStrong}` : 'w-2 bg-white/10'}`}
              />
            ))}
          </div>
        </div>

        {/* Right: Content */}
        <div className="lg:w-2/3 p-8 md:p-16 flex flex-col justify-center relative z-10">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className={`px-3 py-1 ${colors.bg} ${colors.text} border ${colors.border} rounded-full text-[10px] font-black uppercase tracking-[0.3em]`}>
                {t('Step', 'Étape')} {currentStep + 1} / {steps.length}
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-on-surface-variant opacity-40">
                {t('Institutional Protocol', 'Protocole Institutionnel')}
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-4xl md:text-6xl font-black font-headline uppercase tracking-tighter italic leading-none">
                  {step.title.split('. ')[1]}
                </h2>
                <p className="text-on-surface text-lg md:text-xl font-serif italic max-w-2xl leading-relaxed opacity-80">
                  {step.desc}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="pt-12 flex flex-col sm:flex-row items-center gap-4">
              {currentStep > 0 && (
                <button 
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/10 transition-all active:scale-95 rounded-xl"
                >
                  {t('Previous', 'Précédent')}
                </button>
              )}
              
              {currentStep < steps.length - 1 ? (
                <button 
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  className={`w-full sm:w-auto px-10 py-4 ${colors.bgStrong} text-surface-dim text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white transition-all active:scale-95 shadow-[0_20px_40px_rgba(0,0,0,0.3)] rounded-xl flex items-center justify-center gap-3 group`}
                >
                  {t('Next Phase', 'Phase Suivante')}
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <button 
                  onClick={handleDismiss}
                  className="w-full sm:w-auto px-10 py-4 bg-emerald-400 text-surface-dim text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white transition-all active:scale-95 shadow-[0_20px_40px_rgba(52,211,153,0.3)] rounded-xl flex items-center justify-center gap-3 group"
                >
                  {t('Enter Terminal', 'Entrer dans le Terminal')}
                  <CheckCircle2 size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-white/[0.02] px-8 py-4 border-t border-white/5 flex flex-wrap items-center gap-8 justify-center lg:justify-start">
        <div className="flex items-center gap-2 text-[9px] font-black text-on-surface-variant uppercase tracking-widest">
          <Shield size={12} className="text-emerald-400" />
          MiCA COMPLIANT
        </div>
        <div className="flex items-center gap-2 text-[9px] font-black text-on-surface-variant uppercase tracking-widest">
          <Target size={12} className="text-primary-cyan" />
          SEC ALIGNED
        </div>
        <div className="flex items-center gap-2 text-[9px] font-black text-on-surface-variant uppercase tracking-widest">
          <Award size={12} className="text-accent-gold" />
          INSTITUTIONAL GRADE
        </div>
      </div>
    </motion.div>
  );
};

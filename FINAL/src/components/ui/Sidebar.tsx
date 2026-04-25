
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Store, 
  ShieldCheck, 
  Wallet, 
  X,
  Activity,
  FileCode,
  Plus,
  Zap,
  Home,
  Briefcase,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Layers,
  Star,
  Scale,
  Settings,
  Calculator,
  MessageSquare,
  BookOpen
} from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';

import { Logo } from './Logo';

export type View = 'HOME' | 'DASHBOARD' | 'EXCHANGE' | 'VALIDATION' | 'HOLDINGS' | 'REGISTRY' | 'LINK_ART' | 'SETTLEMENT' | 'SIGNUP' | 'LOGIN' | 'PROFILE' | 'PRICING' | 'SWIPE' | 'WATCHLIST' | 'COMPARE' | 'SETTINGS' | 'SOCIAL_FEED' | 'PAYMENT' | 'CONTRACT_DETAIL' | 'TERMS' | 'PRIVACY' | 'LEGAL_REGISTRY' | 'LOUNGE' | 'GOVERNANCE' | 'API' | 'ACADEMY' | 'ABOUT' | 'APPLY_VERIFICATION' | 'TAX_OPTIMIZER';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  isCollapsed?: boolean;
  accentColor?: string;
  badge?: number | string;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active = false, onClick, isCollapsed = false, accentColor = 'primary-cyan', badge }) => (
  <button 
    onClick={onClick}
    title={isCollapsed ? label : undefined}
    className={`w-full flex items-center gap-4 ${isCollapsed ? 'px-0 justify-center' : 'px-6'} py-3 transition-all group relative active:scale-95 ${
      active 
        ? `text-${accentColor} bg-${accentColor}/10 border-l-2 border-${accentColor} shadow-[inset_10px_0_20px_-10px_rgba(0,224,255,0.1)]` 
        : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5 hover:border-l-2 hover:border-white/20'
    }`}
  >
    <div className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'} shrink-0 ${isCollapsed ? 'flex items-center justify-center w-full' : ''} relative`}>
      {icon}
      {badge && isCollapsed && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent-pink rounded-full flex items-center justify-center text-[6px] font-black text-white">
          {badge}
        </div>
      )}
    </div>
    {!isCollapsed && (
      <div className="flex items-center justify-between flex-1">
        <motion.span 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="font-bold whitespace-normal leading-tight"
        >
          {label}
        </motion.span>
        {badge && (
          <div className="px-1.5 py-0.5 bg-accent-pink/20 border border-accent-pink/30 rounded text-[8px] font-black text-accent-pink">
            {badge}
          </div>
        )}
      </div>
    )}
    {active && (
      <div className={`absolute right-0 w-1 h-4 bg-${accentColor} shadow-[0_0_10px_rgba(0,255,255,0.5)]`} />
    )}
  </button>
);

const SystemLog = ({ isCollapsed }: { isCollapsed: boolean }) => {
  const [logs, setLogs] = useState<string[]>([
    '[SYS] BOOTING EXCHANGE SYSTEM...',
    '[SYS] HANDSHAKE: REGISTRY_128',
    '[SYS] SECURING TRANSACTION...'
  ]);

  useEffect(() => {
    const messages = [
      '[NET] SYNCING REGISTRY_DATA...',
      '[SEC] AUDIT VERIFIED: LYA_42',
      '[TRD] MATCHING ENGINE ACTIVE',
      '[SYS] PERFORMANCE OPTIMIZED',
      '[NET] GLOBAL EXCHANGE CONNECTED',
      '[SEC] FRAMEWORK_V4_READY',
      '[TRD] CONTRACT INVENTORY UPDATED'
    ];

    const interval = setInterval(() => {
      const msg = messages[Math.floor(Math.random() * messages.length)];
      setLogs(prev => [msg, ...prev.slice(0, 2)]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  if (isCollapsed) return null;

  return (
    <div className="font-mono text-[7px] text-on-surface-variant/30 uppercase leading-tight min-h-[30px]">
      {logs.map((log, i) => (
        <div key={i}>{log}</div>
      ))}
    </div>
  );
};

interface SidebarProps {
  user: any;
  watchlist: string[];
  onNotify: (msg: string) => void;
  currentView: View;
  onViewChange: (view: View) => void;
  isOpen?: boolean;
  onClose?: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  user,
  watchlist,
  onNotify, 
  currentView, 
  onViewChange, 
  isOpen = true, 
  onClose,
  isCollapsed,
  onToggleCollapse
}) => {
  const { t } = useTranslation();

  return (
    <aside className={`${isOpen ? 'flex' : 'hidden'} lg:flex flex-col h-screen ${isCollapsed ? 'w-16' : 'w-64'} fixed left-0 top-0 border-r border-white/5 bg-surface-dim/95 backdrop-blur-xl z-[60] lg:z-40 overflow-y-auto custom-scrollbar transition-all duration-300 pt-4 pb-8`}>
      <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-white/5 to-transparent" />
      <div className={`mb-6 flex justify-between items-center ${isCollapsed ? 'flex-col gap-4 px-2' : 'px-6'} relative z-10`}>
        <button 
          onClick={() => onViewChange('HOME')}
          className="flex items-center gap-3 active:scale-95 transition-transform"
        >
          <Logo size={isCollapsed ? 48 : 80} color="multi" />
          {!isCollapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="text-base md:text-lg font-black text-white font-headline tracking-tighter">LINKYOURART</div>
              <div className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-primary-cyan font-serif italic opacity-80 break-words leading-tight">{t('Institutional Exchange Center', 'Centre d\'Échanges Institutionnel')}</div>
            </motion.div>
          )}
        </button>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={onToggleCollapse}
            className={`p-2 text-on-surface-variant hover:text-primary-cyan transition-colors hidden lg:block ${isCollapsed ? 'mt-2' : ''}`}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
          {onClose && (
            <button onClick={onClose} className="lg:hidden p-2 text-on-surface-variant hover:text-on-surface">
              <X size={20} />
            </button>
          )}
        </div>
      </div>
      
      <nav className="flex-1 flex flex-col gap-0.5 font-headline text-[11px] md:text-xs uppercase tracking-[0.15em]">
        <div className={`py-2 text-[9px] text-on-surface-variant/50 font-bold tracking-[0.3em] ${isCollapsed ? 'text-center px-0' : 'px-6'}`}>{isCollapsed ? '---' : t("Public Discovery", "Découverte Publique")}</div>
        <NavItem 
          icon={<Home size={16} />} 
          label={t("Home", "Accueil")} 
          active={currentView === 'HOME'}
          isCollapsed={isCollapsed}
          accentColor="primary-cyan"
          onClick={() => onViewChange('HOME')} 
        />
        <NavItem 
          icon={<LayoutDashboard size={16} />} 
          label={t("Dashboard", "Tableau de Bord")} 
          active={currentView === 'DASHBOARD'}
          isCollapsed={isCollapsed}
          accentColor="primary-cyan"
          onClick={() => onViewChange('DASHBOARD')} 
        />
        <NavItem 
          icon={<Activity size={16} />} 
          label={t("Creative Feed", "Fil Créatif")} 
          active={currentView === 'SOCIAL_FEED'}
          isCollapsed={isCollapsed}
          accentColor="primary-cyan"
          onClick={() => onViewChange('SOCIAL_FEED')} 
        />
        <NavItem 
          icon={<Layers size={16} />} 
          label={t("Swipe Discovery", "Découverte Swipe")} 
          active={currentView === 'SWIPE'}
          isCollapsed={isCollapsed}
          accentColor="primary-cyan"
          onClick={() => onViewChange('SWIPE')} 
        />

        <div className={`py-2 mt-4 text-[9px] text-on-surface-variant/50 font-bold tracking-[0.3em] ${isCollapsed ? 'text-center px-0' : 'px-6'}`}>{isCollapsed ? '---' : t("Investor Terminal", "Terminal Investisseur")}</div>
        <NavItem 
          icon={<Star size={16} />} 
          label={t("Watchlist", "Liste de Veille")} 
          active={currentView === 'WATCHLIST'}
          isCollapsed={isCollapsed}
          accentColor="accent-gold"
          onClick={() => onViewChange('WATCHLIST')} 
        />
        <NavItem 
          icon={<Scale size={16} />} 
          label={t("Compare View", "Vue Comparative")} 
          active={currentView === 'COMPARE'}
          isCollapsed={isCollapsed}
          accentColor="primary-cyan"
          onClick={() => onViewChange('COMPARE')} 
        />
        <NavItem 
          icon={<Store size={16} />} 
          label={t("Exchange", "Bourse")} 
          active={currentView === 'EXCHANGE'}
          isCollapsed={isCollapsed}
          accentColor="primary-cyan"
          onClick={() => onViewChange('EXCHANGE')} 
        />
        <NavItem 
          icon={<Briefcase size={16} />} 
          label={t("Portfolio", "Portefeuille")} 
          active={currentView === 'HOLDINGS'}
          isCollapsed={isCollapsed}
          accentColor="primary-cyan"
          onClick={() => onViewChange('HOLDINGS')} 
        />

        <div className={`py-2 mt-4 text-[9px] text-on-surface-variant/50 font-bold tracking-[0.3em] ${isCollapsed ? 'text-center px-0' : 'px-6'}`}>{isCollapsed ? '---' : t("Institutional & Pro", "Institutionnel & Pro")}</div>
        <NavItem 
          icon={<ShieldCheck size={16} />} 
          label={t("Audit Center", "Centre d'Audit")} 
          active={currentView === 'VALIDATION'}
          isCollapsed={isCollapsed}
          accentColor="primary-cyan"
          onClick={() => onViewChange('VALIDATION')} 
        />
        <NavItem 
          icon={<FileCode size={16} />} 
          label={t("Legal Registry", "Registre Légal")} 
          active={currentView === 'REGISTRY'}
          isCollapsed={isCollapsed}
          accentColor="primary-cyan"
          onClick={() => onViewChange('REGISTRY')} 
        />
        <NavItem 
          icon={<Zap size={18} />} 
          label={t("Settlement", "Règlement")} 
          active={currentView === 'SETTLEMENT'}
          isCollapsed={isCollapsed}
          accentColor="primary-cyan"
          onClick={() => onViewChange('SETTLEMENT')} 
        />
        <NavItem 
          icon={<MessageSquare size={16} />} 
          label={t("Elite Lounge", "Salon Élite")} 
          active={currentView === 'LOUNGE'}
          isCollapsed={isCollapsed}
          accentColor="accent-gold"
          onClick={() => onViewChange('LOUNGE')} 
        />
        <NavItem 
          icon={<Calculator size={16} />} 
          label={t("Tax Optimizer", "Optimiseur Fiscal")} 
          active={currentView === 'TAX_OPTIMIZER'}
          isCollapsed={isCollapsed}
          accentColor="accent-magenta"
          onClick={() => onViewChange('TAX_OPTIMIZER')} 
        />
        <NavItem 
          icon={<CreditCard size={16} />} 
          label={t("Pricing", "Tarifs")} 
          active={currentView === 'PRICING'}
          isCollapsed={isCollapsed}
          accentColor="accent-gold"
          onClick={() => onViewChange('PRICING')} 
        />
        <NavItem 
          icon={<Scale size={16} />} 
          label={t("Governance", "Gouvernance")} 
          active={currentView === 'GOVERNANCE'}
          isCollapsed={isCollapsed}
          accentColor="primary-cyan"
          onClick={() => onViewChange('GOVERNANCE')} 
        />
        <NavItem 
          icon={<FileCode size={16} />} 
          label={t("API Access", "Accès API")} 
          active={currentView === 'API'}
          isCollapsed={isCollapsed}
          accentColor="primary-cyan"
          onClick={() => onViewChange('API')} 
        />
        <NavItem 
          icon={<BookOpen size={16} />} 
          label={t("Academy", "Académie")} 
          active={currentView === 'ACADEMY'}
          isCollapsed={isCollapsed}
          accentColor="accent-gold"
          onClick={() => onViewChange('ACADEMY')} 
        />
        <NavItem 
          icon={<ShieldCheck size={16} />} 
          label={t("Verification", "Vérification")} 
          active={currentView === 'APPLY_VERIFICATION'}
          isCollapsed={isCollapsed}
          accentColor="accent-gold"
          onClick={() => onViewChange('APPLY_VERIFICATION')} 
        />
      </nav>

      <div className={`${isCollapsed ? 'px-2' : 'px-6'} mb-4`}>
        <div className={`py-2 mb-2 text-[9px] text-on-surface-variant/50 font-bold tracking-[0.3em] ${isCollapsed ? 'text-center px-0' : 'px-0'}`}>{isCollapsed ? '---' : t("Creator Hub", "Hub Créateur")}</div>
          <button 
            onClick={() => {
              onViewChange('LINK_ART');
              onNotify(t('INITIALIZING CONTRACT ISSUANCE...', 'INITIALISATION DE L\'ÉMISSION DE CONTRAT...'));
            }}
            className={`w-full flex items-center justify-center gap-3 py-3.5 font-black text-[11px] md:text-xs uppercase tracking-[0.25em] transition-all active:scale-95 border ${isCollapsed ? 'px-0' : 'px-4'} ${
              currentView === 'LINK_ART' 
                ? 'bg-white text-surface-dim border-white shadow-[0_0_25px_rgba(255,255,255,0.3)]' 
                : 'bg-primary-cyan text-surface-dim border-primary-cyan shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:bg-white hover:border-white hover:text-surface-dim'
            }`}
          >
          <Plus size={16} />
          {!isCollapsed && <span>{t("Contract Issuance", "Émission de Contrat")}</span>}
        </button>
      </div>

      {!isCollapsed && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-6 space-y-6 mt-4"
        >
          <div className="p-4 bg-surface-highest/20 border border-white/5 rounded-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">{t("Active Registries", "Registres Actifs")}</span>
              <span className="text-xs font-mono text-primary-cyan">128 {t("ACTIVE", "ACTIFS")}</span>
            </div>
            <div className="relative h-20 overflow-hidden">
              <svg viewBox="0 0 200 100" className="w-full h-full stroke-primary-cyan/30 fill-none opacity-40">
                <path d="M20,50 Q60,20 100,50 T180,50" strokeWidth="0.5" />
                <path d="M30,30 Q80,80 130,30 T170,70" strokeWidth="0.5" />
                <motion.circle 
                  cx="20" cy="50" r="1.5" 
                  animate={{ r: [1.5, 3, 1.5], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="fill-primary-cyan" 
                />
                <motion.circle 
                  cx="100" cy="50" r="1.5" 
                  animate={{ r: [1.5, 3, 1.5], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                  className="fill-primary-cyan" 
                />
                <motion.circle 
                  cx="180" cy="50" r="1.5" 
                  animate={{ r: [1.5, 3, 1.5], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                  className="fill-primary-cyan" 
                />
                <motion.circle 
                  cx="130" cy="30" r="1.5" 
                  animate={{ r: [1.5, 3, 1.5], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2.2, repeat: Infinity, delay: 0.2 }}
                  className="fill-primary-cyan" 
                />
              </svg>
            </div>
            <div className="mt-3 text-xs font-mono text-on-surface-variant/40 leading-tight">
              {t("RESPONSE: REAL-TIME", "RÉPONSE : TEMPS RÉEL")} <br />
              {t("AVAILABILITY: 99.99%", "DISPONIBILITÉ : 99.99%")}
            </div>
          </div>
        </motion.div>
      )}

      <div className="mt-auto pt-6 border-t border-white/5 flex flex-col gap-0.5 font-headline text-[11px] md:text-xs uppercase tracking-[0.15em]">
        <NavItem 
          icon={<Settings size={16} />} 
          label={t("Settings", "Paramètres")} 
          active={currentView === 'SETTINGS'}
          isCollapsed={isCollapsed}
          accentColor="primary-cyan"
          onClick={() => {
            onViewChange('SETTINGS');
            onNotify(t('ACCESSING SETTINGS...', 'ACCÈS AUX PARAMÈTRES...'));
          }} 
        />
        
        <button 
          onClick={() => {
            if (user) {
              onViewChange('PROFILE');
              onNotify(t('ACCESSING PROFILE...', 'ACCÈS AU PROFIL...'));
            } else {
              onViewChange('LOGIN');
              onNotify(t('PLEASE LOGIN TO ACCESS PROFILE', 'VEUILLEZ VOUS CONNECTER POUR ACCÉDER AU PROFIL'));
            }
          }}
          className={`flex items-center gap-3 w-full p-2 hover:bg-white/5 transition-all ${isCollapsed ? 'justify-center' : 'px-6 mb-6'}`}
        >
          <div className="w-10 h-10 bg-surface-high rounded-full flex items-center justify-center border border-primary-cyan/30 overflow-hidden p-0.5 shrink-0 shadow-[0_0_15px_rgba(0,224,255,0.1)]">
            <img 
              src={user?.avatarUrl || (user ? `https://picsum.photos/seed/${user.uid}/100/100` : "https://picsum.photos/seed/user/100/100")} 
              alt="User avatar" 
              className="w-full h-full object-cover rounded-full"
              referrerPolicy="no-referrer"
            />
          </div>
          {!isCollapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-left">
              <div className="text-sm font-bold text-on-surface">{user ? user.displayName : 'Gallery Alpha'}</div>
              <div className="text-[9px] text-accent-gold font-serif italic uppercase tracking-widest opacity-70">{user ? t("Tier: Institutional", "Niveau : Institutionnel") : t("Platform Brand", "Marque Plateforme")}</div>
            </motion.div>
          )}
        </button>

        <SystemLog isCollapsed={isCollapsed} />

        {!isCollapsed && (
          <div className="px-6 py-4 flex gap-4 border-t border-white/5">
            <button 
              onClick={() => onViewChange('TERMS')}
              className="text-[8px] font-black uppercase tracking-widest text-on-surface-variant/40 hover:text-primary-cyan transition-colors"
            >
              {t('Terms', 'Conditions')}
            </button>
            <button 
              onClick={() => onViewChange('PRIVACY')}
              className="text-[8px] font-black uppercase tracking-widest text-on-surface-variant/40 hover:text-primary-cyan transition-colors"
            >
              {t('Privacy', 'Confidentialité')}
            </button>
            <button 
              onClick={() => onViewChange('LEGAL_REGISTRY')}
              className="text-[8px] font-black uppercase tracking-widest text-on-surface-variant/40 hover:text-primary-cyan transition-colors"
            >
              {t('Registries', 'Registres')}
            </button>
            <button 
              onClick={() => onViewChange('ABOUT')}
              className="text-[8px] font-black uppercase tracking-widest text-on-surface-variant/40 hover:text-primary-cyan transition-colors"
            >
              {t('About', 'A Propos')}
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

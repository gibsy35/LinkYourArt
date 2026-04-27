
import React from 'react';
import { Search, Bell, UserCircle, LayoutDashboard, LogIn, X, Crown } from 'lucide-react';
import { View } from './Sidebar';
import { useTranslation } from '../../context/LanguageContext';
import { useCurrency, Currency } from '../../context/CurrencyContext';

import { Logo } from './Logo';
import { CONTRACTS, UserProfile, UserRole } from '../../types';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';

interface TopbarProps {
  user: UserProfile | null;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  onNotify: (msg: string) => void;
  onToggleMobileMenu: () => void;
  currentView: View;
  onViewChange: (view: View) => void;
  isSidebarCollapsed: boolean;
  setUser: (user: UserProfile | null) => void;
  notifications: { id: string, title: string, message: string, timestamp: string, read: boolean, type: 'INFO' | 'SUCCESS' | 'WARNING' }[];
  setNotifications: React.Dispatch<React.SetStateAction<{ id: string, title: string, message: string, timestamp: string, read: boolean, type: 'INFO' | 'SUCCESS' | 'WARNING' }[]>>;
}

export const Topbar: React.FC<TopbarProps> = ({ 
  user,
  searchTerm, 
  setSearchTerm, 
  onNotify, 
  onToggleMobileMenu,
  currentView,
  onViewChange,
  isSidebarCollapsed,
  setUser,
  notifications,
  setNotifications
}) => {
  const { language, setLanguage, t } = useTranslation();
  const { currency, setCurrency, formatLYA } = useCurrency();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onNotify(t('LOGGED OUT SUCCESSFULLY', 'DÉCONNEXION RÉUSSIE'));
      onViewChange('HOME');
    } catch (err) {
      console.error('Logout Error:', err);
    }
  };

  return (
    <nav className={`fixed top-0 right-0 left-0 transition-all duration-300 ${isSidebarCollapsed ? 'lg:left-16' : 'lg:left-64'} z-50 bg-surface-dim/80 backdrop-blur-xl border-b border-white/5`}>
      <div className="px-6 py-2 flex justify-between items-center h-14 relative">
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary-cyan/10 to-transparent" />
        <div className="flex items-center gap-6 lg:gap-10">
          <button 
            onClick={onToggleMobileMenu}
            className="lg:hidden p-1.5 hover:bg-white/5 rounded transition-colors text-primary-cyan active:scale-95"
          >
            <LayoutDashboard size={18} />
          </button>
          <div className="lg:hidden flex items-center gap-2">
            <Logo size={40} color="multi" />
            <span className="text-lg font-black tracking-tighter text-white font-headline">LINKYOURART</span>
          </div>
          <div className="hidden lg:flex flex-wrap items-center gap-1 xl:gap-3 font-headline tracking-widest text-[9px] xl:text-[10px] uppercase">
            <button 
              onClick={() => {
                onViewChange('HOME');
                onNotify(t('RETURNING HOME...', 'RETOUR À L\'ACCUEIL...'));
              }}
              className={`h-11 px-2 xl:px-4 transition-all hover:tracking-[0.2em] active:scale-95 flex items-center whitespace-nowrap ${
                currentView === 'HOME' ? 'text-accent-purple border-b-2 border-accent-purple' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {t('Home', 'Accueil')}
            </button>
            <button 
              onClick={() => {
                onViewChange('DASHBOARD');
                onNotify(t('ACCESSING MARKET OVERVIEW...', 'ACCÈS À L\'APERÇU DU MARCHÉ...'));
              }}
              className={`h-11 px-2 xl:px-4 transition-all hover:tracking-[0.2em] active:scale-95 flex items-center whitespace-nowrap ${
                currentView === 'DASHBOARD' ? 'text-primary-cyan border-b-2 border-primary-cyan' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {t('Market Overview', 'Aperçu du Marché')}
            </button>
            <button 
              onClick={() => {
                onViewChange('EXCHANGE');
                onNotify(t('ACCESSING REGISTRY...', 'ACCÈS AU REGISTRE...'));
              }}
              className={`h-11 px-2 xl:px-4 transition-all hover:tracking-[0.2em] active:scale-95 flex items-center whitespace-nowrap ${
                currentView === 'EXCHANGE' ? 'text-accent-green border-b-2 border-accent-green' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {t('Registry', 'Registre')}
            </button>
            <button 
              onClick={() => {
                onViewChange('SETTLEMENT');
                onNotify(t('ACCESSING SETTLEMENT CENTER...', 'ACCÈS AU CENTRE DE RÈGLEMENT...'));
              }}
              className={`h-11 px-2 xl:px-4 transition-all hover:tracking-[0.2em] active:scale-95 flex items-center whitespace-nowrap ${
                currentView === 'SETTLEMENT' ? 'text-accent-yellow border-b-2 border-accent-yellow' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {t('Settlement Center', 'Centre de Règlement')}
            </button>
          </div>
        </div>
        events-none group-focus-within:opacity-0 transition-opacity">
              <span>⌘</span>
              <span>K</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Currency Selector */}
            <div className="flex items-center bg-surface-highest/30 border border-white/5 rounded-sm p-0.5">
              {(['USD', 'EUR', 'GBP'] as Currency[]).map((cur) => (
                <React.Fragment key={cur}>
                  <button 
                    onClick={() => {
                      setCurrency(cur);
                      onNotify(`${t('CURRENCY CHANGED:', 'DEVISE CHANGÉE :')} ${cur}`);
                    }}
                    className={`px-2 py-1 text-[9px] font-black uppercase tracking-widest transition-all ${
                      currency === cur 
                        ? 'bg-accent-gold text-surface-dim shadow-[0_0_10px_rgba(238,192,94,0.3)]' 
                        : 'text-on-surface-variant hover:text-white'
                    }`}
                  >
                    {cur === 'USD' ? '$' : cur === 'EUR' ? '€' : '£'}
                  </button>
                  {cur !== 'GBP' && <div className="w-[1px] h-3 bg-white/10 mx-0.5" />}
                </React.Fragment>
              ))}
            </div>

            <div className="flex items-center bg-surface-highest/30 border border-white/5 rounded-sm p-0.5">
              <button 
                onClick={() => {
                  setLanguage('EN');
                  onNotify('LANGUAGE: ENGLISH');
                }}
                className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest transition-all ${
                  language === 'EN' 
                    ? 'bg-primary-cyan text-surface-dim shadow-[0_0_10px_rgba(0,224,255,0.3)]' 
                    : 'text-on-surface-variant hover:text-white'
                }`}
              >
                EN
              </button>
              <div className="w-[1px] h-3 bg-white/10 mx-0.5" />
              <button 
                onClick={() => {
                  setLanguage('FR');
                  onNotify('LANGUE: FRANÇAIS');
                }}
                className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest transition-all ${
                  language === 'FR' 
                    ? 'bg-primary-cyan text-surface-dim shadow-[0_0_10px_rgba(0,224,255,0.3)]' 
                    : 'text-on-surface-variant hover:text-white'
                }`}
              >
                FR
              </button>
            </div>
            <button 
              onClick={() => onNotify(t('NO NEW NOTIFICATIONS.', 'PAS DE NOUVELLES NOTIFICATIONS.'))}
              className="p-2 hover:bg-white/5 rounded transition-colors text-on-surface-variant relative active:scale-95"
            >
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-accent-gold rounded-full shadow-[0_0_8px_rgba(238,192,94,0.8)]"></span>
            </button>
            <div className="relative">
              <div 
                className={`p-1.5 rounded-full transition-all flex items-center gap-2 border ${
                  user 
                    ? 'text-primary-cyan bg-primary-cyan/10 border-primary-cyan/30 shadow-[0_0_15px_rgba(0,224,255,0.2)]' 
                    : 'text-on-surface-variant hover:bg-white/5 border-white/10 hover:border-white/20 cursor-pointer'
                }`}
                onClick={() => {
                  if (!user) {
                    onViewChange('LOGIN');
                  }
                }}
              >
                {user ? (
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => onViewChange('PROFILE')}
                      className="flex items-center gap-2 hover:opacity-80 transition-opacity active:scale-95"
                    >
                      <div className="w-7 h-7 rounded-full overflow-hidden border border-primary-cyan/30 bg-primary-cyan/10 flex items-center justify-center">
                        {user.avatarUrl ? (
                          <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <span className="text-[10px] font-black text-primary-cyan">
                            {user.displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-1">
                          <p className="text-[10px] font-black uppercase italic tracking-tighter leading-none text-white">{user.displayName}</p>
                          {user.role === UserRole.ADMIN && <Crown size={10} className="text-accent-gold" />}
                        </div>
                        <p className="text-[8px] font-mono uppercase tracking-widest text-primary-cyan opacity-60">{user.role}</p>
                      </div>
                    </button>
                    <div className="w-[1px] h-6 bg-white/10 mx-1" />
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLogout();
                      }}
                      className="p-2 hover:bg-red-500/10 rounded-full text-on-surface-variant hover:text-red-400 transition-all active:scale-90"
                      title={t('Logout', 'Déconnexion')}
                    >
                      <LogIn size={14} className="rotate-180" />
                    </button>
                  </div>
                ) : (
                  <div className="p-1">
                    <UserCircle size={20} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

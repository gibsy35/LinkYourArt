
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Command, 
  LayoutDashboard, 
  ArrowRightLeft, 
  ShieldCheck, 
  Wallet, 
  Database, 
  Settings, 
  LogOut,
  X,
  Zap,
  TrendingUp,
  FileText
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { CONTRACTS, Contract } from '../types';
import { View } from './ui/Sidebar';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onViewChange: (view: View) => void;
  onSelectContract: (contract: Contract) => void;
  onLogout: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ 
  isOpen, 
  onClose, 
  onViewChange, 
  onSelectContract,
  onLogout 
}) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const navigationItems = [
    { id: 'DASHBOARD', label: t('Dashboard', 'Tableau de Bord'), icon: <LayoutDashboard size={18} />, category: 'NAVIGATION' },
    { id: 'EXCHANGE', label: t('Exchange', 'Échange'), icon: <ArrowRightLeft size={18} />, category: 'NAVIGATION' },
    { id: 'VALIDATION', label: t('Validation', 'Validation'), icon: <ShieldCheck size={18} />, category: 'NAVIGATION' },
    { id: 'HOLDINGS', label: t('Holdings', 'Portefeuille'), icon: <Wallet size={18} />, category: 'NAVIGATION' },
    { id: 'REGISTRY', label: t('Registry', 'Registre'), icon: <Database size={18} />, category: 'NAVIGATION' },
    { id: 'SETTINGS', label: t('Settings', 'Paramètres'), icon: <Settings size={18} />, category: 'NAVIGATION' },
  ];

  const filteredContracts = CONTRACTS.filter(c => 
    c.name.toLowerCase().includes(query.toLowerCase()) || 
    c.registryIndex.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  const filteredNav = navigationItems.filter(item => 
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  const results = [
    ...filteredNav.map(item => ({ ...item, type: 'NAV' })),
    ...filteredContracts.map(c => ({ 
      id: c.id, 
      label: c.name, 
      subLabel: c.registryIndex,
      icon: <FileText size={18} />, 
      category: 'CONTRACTS',
      type: 'CONTRACT',
      data: c
    })),
    { id: 'LOGOUT', label: t('Logout', 'Déconnexion'), icon: <LogOut size={18} />, category: 'SYSTEM', type: 'ACTION' }
  ].filter(item => item.label.toLowerCase().includes(query.toLowerCase()) || (item as any).subLabel?.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // This will be handled by the parent component
        }
      }

      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % results.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleSelect(results[selectedIndex]);
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose]);

  const handleSelect = (item: any) => {
    if (!item) return;
    
    if (item.type === 'NAV') {
      onViewChange(item.id as View);
    } else if (item.type === 'CONTRACT') {
      onSelectContract(item.data);
    } else if (item.type === 'ACTION') {
      if (item.id === 'LOGOUT') onLogout();
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[2000] flex items-start justify-center pt-[15vh] px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-surface-dim/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="w-full max-w-2xl bg-surface-low border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative z-10"
          >
            <div className="flex items-center px-6 py-4 border-b border-white/5 bg-white/[0.02]">
              <Search className="text-primary-cyan mr-4" size={20} />
              <input 
                ref={inputRef}
                type="text" 
                placeholder={t('Search contracts, views, or actions...', 'Rechercher des contrats, vues ou actions...')}
                className="flex-1 bg-transparent border-none outline-none text-white font-mono text-lg placeholder:text-on-surface-variant/30"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
              />
              <div className="flex items-center gap-2 px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black text-on-surface-variant">
                <Command size={10} /> K
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2">
              {results.length > 0 ? (
                <div className="space-y-1">
                  {results.map((item, index) => {
                    const isSelected = index === selectedIndex;
                    return (
                      <button
                        key={`${item.type}-${item.id}`}
                        onClick={() => handleSelect(item)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                          isSelected ? 'bg-primary-cyan text-surface-dim' : 'hover:bg-white/5 text-on-surface'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`${isSelected ? 'text-surface-dim' : 'text-primary-cyan'}`}>
                            {item.icon}
                          </div>
                          <div className="text-left">
                            <div className="text-sm font-black uppercase tracking-tight">{item.label}</div>
                            {(item as any).subLabel && (
                              <div className={`text-[10px] font-mono ${isSelected ? 'text-surface-dim/60' : 'text-on-surface-variant'}`}>
                                {(item as any).subLabel}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${
                            isSelected ? 'border-surface-dim/20 bg-surface-dim/10' : 'border-white/10 bg-white/5 text-on-surface-variant'
                          }`}>
                            {item.category}
                          </span>
                          {isSelected && <Zap size={14} className="animate-pulse" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto text-on-surface-variant/20">
                    <Search size={32} />
                  </div>
                  <div className="text-on-surface-variant text-sm font-black uppercase tracking-widest italic">
                    {t('No intelligence found for your query', 'Aucune intelligence trouvée pour votre requête')}
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-3 bg-white/[0.02] border-t border-white/5 flex items-center justify-between text-[9px] font-black text-on-surface-variant uppercase tracking-widest">
              <div className="flex gap-4">
                <span className="flex items-center gap-1"><TrendingUp size={10} /> ↑↓ {t('Navigate', 'Naviguer')}</span>
                <span className="flex items-center gap-1"><Zap size={10} /> Enter {t('Select', 'Sélectionner')}</span>
              </div>
              <div>LYA_TERMINAL_V2.5</div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

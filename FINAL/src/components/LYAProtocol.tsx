import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, Target, Scale, Info, Award } from 'lucide-react';

interface LYAProtocolModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LYAProtocolModal: React.FC<LYAProtocolModalProps> = ({ isOpen, onClose }) => {
  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,224,255,0.1)]"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-surface-base">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-cyan/10 flex items-center justify-center border border-primary-cyan/20">
                  <Shield className="text-primary-cyan" size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-black uppercase tracking-widest text-white">LYA Protocol</h2>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold opacity-50">The New Standard for Creative Assets</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-full transition-colors text-on-surface-variant hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 max-h-[70vh] overflow-y-auto custom-scrollbar space-y-8">
              {/* Unique Model */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-primary-cyan">
                  <Target size={16} />
                  <h3 className="text-xs font-black uppercase tracking-widest">A Unique Model</h3>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  A third way between traditional crowdfunding and equity crowdfunding. 
                  Creative projects are living assets, whose value evolves over time according to their real development. 
                  LinkYourArt creates a third way: a system of indexed contractual rights, transparent and secure.
                </p>
              </section>

              {/* The Third Way Grid */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: 'Indexed Rights', desc: 'Contractual rights (not shares) linked to the LYA score.' },
                  { title: 'Objective Valuation', desc: 'LYA score /1000 calculated by certified professionals and AI.' },
                  { title: 'P2P Secondary Market', desc: 'Exchange your rights 24/7 on our platform.' },
                  { title: 'Legal Security', desc: 'Clear contracts and protected intellectual property.' },
                  { title: 'Transparency', desc: 'Fluid process without excessive bureaucracy.' },
                  { title: 'Ecosystem', desc: 'Creators, investors, and professionals united.' }
                ].map((item, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-white">{item.title}</h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </section>

              {/* Fundamental Principles */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-primary-cyan">
                  <Award size={16} />
                  <h3 className="text-xs font-black uppercase tracking-widest">Fundamental Principles</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { title: 'Total Transparency', desc: 'All evaluation criteria are public, LYA score is objectively calculated.' },
                    { title: 'Equity for All', desc: 'Creators, investors, and professionals benefit. Fixed price of $50 per LYA Unit.' },
                    { title: 'Creative Merit', desc: 'Evaluation based on artistic quality, potential, and viability - not popularity.' },
                    { title: 'Legal Protection', desc: 'Protected copyrights, clear contracts, full legal compliance.' }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="mt-1 w-1 h-1 rounded-full bg-primary-cyan shrink-0" />
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white block">{item.title}</span>
                        <p className="text-xs text-on-surface-variant leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Legal Warning */}
              <section className="p-4 rounded-xl bg-primary-cyan/5 border border-primary-cyan/10 flex gap-4">
                <Info className="text-primary-cyan shrink-0" size={18} />
                <div className="space-y-2">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-primary-cyan">Legal Notice</h3>
                  <p className="text-[11px] text-on-surface-variant leading-relaxed italic">
                    LYA Units are indexed contractual rights and do not constitute shares, financial securities, or regulated investment products. 
                    No promise of yield is guaranteed. The value of your rights can evolve upwards or downwards based on objective indicators. 
                    LinkYourArt acts as a trusted third party for analysis and valuation.
                  </p>
                </div>
              </section>
            </div>

            {/* Footer */}
            <div className="p-4 bg-surface-base border-t border-white/5 flex justify-end">
              <button 
                onClick={onClose}
                className="px-6 py-2 bg-primary-cyan text-black text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-white transition-all"
              >
                Understood
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export const LYAProtocolBadge: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="group relative flex items-center gap-3 px-5 py-2.5 bg-primary-cyan/5 border border-primary-cyan/20 rounded-full hover:border-primary-cyan/60 hover:bg-primary-cyan/10 transition-all duration-500 shadow-[0_0_20px_rgba(0,224,255,0.05)] hover:shadow-[0_0_30px_rgba(0,224,255,0.15)]"
      >
        <div className="relative">
          <Shield className="text-primary-cyan group-hover:scale-110 transition-transform" size={14} />
          <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary-cyan animate-ping opacity-40" />
          <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary-cyan" />
        </div>
        <div className="flex flex-col items-start">
          <span className="text-[9px] font-black uppercase tracking-[0.25em] text-primary-cyan group-hover:text-white transition-colors">
            LYA Protocol
          </span>
          <span className="text-[7px] font-bold uppercase tracking-widest text-on-surface-variant opacity-40 group-hover:opacity-100 transition-opacity">
            Click for Info
          </span>
        </div>
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-cyan/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>

      <LYAProtocolModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

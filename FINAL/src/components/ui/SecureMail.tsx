
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, X, Mail, ShieldCheck, ArrowRight, User } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';

interface SecureMailProps {
  recipient: { name: string, role: string };
  onClose: () => void;
  onSent: () => void;
}

export const SecureMail: React.FC<SecureMailProps> = ({ recipient, onClose, onSent }) => {
  const { t } = useTranslation();
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = () => {
    if (!subject || !body) return;
    setIsSending(true);
    setTimeout(() => {
      onSent();
      onClose();
    }, 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-surface-dim/80 backdrop-blur-2xl"
    >
      <div className="w-full max-w-2xl bg-surface-low border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col h-[600px]">
        {/* Header */}
        <div className="flex items-center justify-between px-10 py-8 bg-white/5 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary-cyan/10 flex items-center justify-center text-primary-cyan">
              <Mail size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">{t('SECURE INSTITUTIONAL MAIL', 'COURRIEL INSTITUTIONNEL SÉCURISÉ')}</h3>
              <div className="flex items-center gap-2">
                <ShieldCheck size={12} className="text-emerald-500" />
                <span className="text-[9px] text-emerald-500 font-black uppercase tracking-widest">{t('END-TO-END ENCRYPTED', 'CHIFFRE DE BOUT EN BOUT')}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-4 hover:bg-white/5 rounded-full transition-colors text-on-surface-variant">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 p-10 space-y-8 overflow-y-auto custom-scrollbar">
          <div className="flex items-center gap-4 py-4 border-b border-white/5">
             <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest w-12">{t('TO:', 'À :')}</span>
             <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-surface-high flex items-center justify-center text-primary-cyan border border-white/5">
                 <User size={14} />
               </div>
               <div>
                  <span className="text-sm font-black text-white italic">{recipient.name}</span>
                  <span className="text-[9px] text-accent-gold font-black uppercase tracking-widest ml-3">/ {recipient.role}</span>
               </div>
             </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em]">{t('SUBJECT', 'SUJET')}</label>
            <input 
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={t('INITIATING STRATEGIC DIALOG...', 'INITIATION D\'UN DIALOGUE STRATÉGIQUE...')}
              className="w-full bg-transparent border-b border-white/10 py-3 text-sm font-bold text-white focus:outline-none focus:border-primary-cyan transition-colors"
            />
          </div>

          <div className="space-y-4 flex-1">
            <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em]">{t('MESSAGE', 'MESSAGE')}</label>
            <textarea 
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={t('Type your professional inquiry here...', 'Tapez votre demande professionnelle ici...')}
              className="w-full bg-white/5 border border-white/5 rounded-2xl p-6 text-sm font-medium text-white/80 focus:outline-none focus:border-primary-cyan/40 transition-colors min-h-[200px] resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-10 border-t border-white/5">
          <button 
            onClick={handleSend}
            disabled={isSending || !subject || !body}
            className={`w-full py-5 rounded-2xl font-black uppercase italic tracking-[0.4em] text-xs transition-all flex items-center justify-center gap-4 ${
              isSending 
                ? 'bg-emerald-500 text-surface-dim' 
                : 'bg-primary-cyan text-surface-dim hover:bg-white active:scale-95 shadow-[0_20px_40px_rgba(0,224,255,0.2)]'
            }`}
          >
            {isSending ? (
              <>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-5 h-5 border-2 border-surface-dim border-t-transparent rounded-full" />
                <span>{t('ENCRYPTING & SENDING...', 'CHIFFREMENT ET ENVOI...')}</span>
              </>
            ) : (
              <>
                <Send size={18} />
                <span>{t('SEND SECURE MAIL', 'ENVOYER LE COURRIEL SÉCURISÉ')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

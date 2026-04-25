
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, X, Bot, Zap, ChevronRight } from 'lucide-react';
import { askCopilotStream } from '../services/geminiService';
import { useTranslation } from '../context/LanguageContext';
import { GenerateContentResponse } from '@google/genai';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface SYACopilotProps {
  isProfessionalChatActive?: boolean;
}

export const LYACopilot: React.FC<SYACopilotProps> = ({ isProfessionalChatActive }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isProfessionalChatActive && isOpen) {
      setIsOpen(false);
    }
  }, [isProfessionalChatActive, isOpen]);

  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: t(
        "Bonjour ! Je suis LYA Copilot, votre assistant d'intelligence créative. Comment puis-je optimiser vos investissements aujourd'hui ?",
        "Bonjour ! Je suis LYA Copilot, votre assistant d'intelligence créative. Comment puis-je optimiser vos investissements aujourd'hui ?"
      ) 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
      setIsAutoScrollEnabled(isAtBottom);
    }
  };

  useEffect(() => {
    if (scrollRef.current && isAutoScrollEnabled) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, isAutoScrollEnabled]);

  const handleSend = async (overrideMsg?: string) => {
    const userMsg = overrideMsg || query.trim();
    if (!userMsg || isLoading) return;

    setQuery('');
    const newUserMsg: Message = { role: 'user', content: userMsg };
    setMessages(prev => [...prev, newUserMsg]);
    setIsLoading(true);

    try {
      const context = "User is browsing LinkYourArt, an Institutional Exchange Center for indexed creative contracts (LYA Units). 1 LYA Unit = $50. Contracts have LYA Scores (0-1000) based on Quality, Marketability, Legal, Tech, and Growth. Be concise, professional, and helpful. Respond in the language the user uses.";
      const stream = await askCopilotStream(userMsg, context);
      
      setIsLoading(false);
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
      setIsTyping(true);

      let fullResponse = '';
      for await (const chunk of stream) {
        const c = chunk as GenerateContentResponse;
        const text = c.text || '';
        fullResponse += text;
        
        setMessages(prev => {
          const next = [...prev];
          next[next.length - 1] = { role: 'assistant', content: fullResponse };
          return next;
        });
      }
      setIsTyping(false);
    } catch (error) {
      setIsLoading(false);
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'assistant', content: "Désolé, j'ai rencontré une erreur. Veuillez réessayer." }]);
    }
  };

  const quickActions = [
    t("Analyse des risques", "Analyse des risques"),
    t("Calcul du Yield", "Calcul du Yield"),
    t("Opportunités Fine Art", "Opportunités Fine Art"),
    t("Standard LYA ($50)", "Standard LYA ($50)")
  ];

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 20, scale: 0.95, filter: 'blur(10px)' }}
            className="absolute bottom-16 right-0 w-[calc(100vw-2rem)] sm:w-[360px] h-[500px] sm:h-[600px] max-h-[calc(100vh-100px)] bg-surface-dim/95 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden rounded-3xl backdrop-blur-3xl ring-1 ring-white/5"
          >
            {/* Header - Premium Glassmorphism */}
            <div className="p-4 sm:p-5 flex items-center justify-between border-b border-white/10 bg-surface-low/80 backdrop-blur-xl relative shrink-0">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary-cyan to-transparent" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="relative group">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-cyan/20 rounded-2xl flex items-center justify-center border border-primary-cyan/30 overflow-hidden group-hover:border-primary-cyan/50 transition-all duration-500 shadow-[0_0_20px_rgba(0,224,255,0.2)]">
                    <Bot size={20} className="text-primary-cyan animate-pulse" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-surface-dim rounded-full flex items-center justify-center border border-white/20 shadow-lg">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black uppercase italic tracking-tighter text-white flex items-center gap-2">
                    LYA <span className="text-primary-cyan">COPILOT</span>
                  </h3>
                  <div className="flex items-center gap-2">
                    <p className="text-[7px] sm:text-[8px] text-on-surface-variant font-black uppercase tracking-[0.3em] opacity-60">Neural Intelligence</p>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span className="text-[7px] sm:text-[8px] text-primary-cyan font-bold uppercase tracking-widest">v4.2 PRO</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-white/5 hover:bg-red-500/20 rounded-xl text-white/40 hover:text-red-400 transition-all active:scale-90 border border-white/10 hover:border-red-500/30"
              >
                <X size={16} />
              </button>
            </div>

            {/* Chat Area - Refined Typography */}
            <div 
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-8 scrollbar-none relative bg-surface-dim"
              style={{ scrollBehavior: 'smooth' }}
            >
              <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ 
                backgroundImage: 'radial-gradient(circle at 2px 2px, #00E0FF 1px, transparent 0)',
                backgroundSize: '24px 24px'
              }} />
              
              {messages.map((msg, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  key={i} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} relative z-10`}
                >
                  <div className={`max-w-[88%] p-4 sm:p-5 rounded-2xl text-[12px] sm:text-[13px] leading-relaxed relative shadow-2xl border ${
                    msg.role === 'user' 
                      ? 'bg-primary-cyan text-surface-dim font-black italic border-primary-cyan/50 shadow-[0_10px_30px_rgba(0,224,255,0.2)] rounded-tr-none' 
                      : 'bg-surface-low/60 text-white/90 border-white/10 backdrop-blur-xl rounded-tl-none'
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {(isLoading || isTyping) && (
                <div className="flex justify-start relative z-10">
                  <div className="bg-surface-low/60 border border-white/10 p-4 rounded-2xl flex gap-2 items-center">
                    <div className="w-1.5 h-1.5 bg-primary-cyan rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-primary-cyan rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-primary-cyan rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions - Compact Pills */}
            <div className="px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide border-t border-white/5 bg-surface-low/40 shrink-0">
              {quickActions.map((action, i) => (
                <button 
                  key={i}
                  onClick={() => handleSend(action)}
                  className="whitespace-nowrap px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[8px] font-black uppercase tracking-widest text-on-surface-variant hover:bg-primary-cyan/10 hover:text-primary-cyan hover:border-primary-cyan/40 transition-all active:scale-95"
                >
                  {action}
                </button>
              ))}
            </div>

            {/* Input Area - High Tech Terminal */}
            <div className="p-4 sm:p-5 bg-surface-low/80 backdrop-blur-xl border-t border-white/5 relative shrink-0">
              <div className="relative flex items-center gap-3">
                <div className="flex-1 relative group">
                  <input 
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={t("Interroger LYA Terminal...", "Interroger LYA Terminal...")}
                    className="w-full bg-surface-dim border border-white/10 text-[10px] sm:text-[11px] px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl focus:outline-none focus:border-primary-cyan/40 transition-all placeholder:text-on-surface-variant/30 font-bold tracking-widest text-white"
                  />
                </div>
                <button 
                  onClick={() => handleSend()}
                  disabled={!query.trim() || isLoading}
                  className="w-10 h-10 sm:w-11 sm:h-11 bg-primary-cyan text-surface-dim flex items-center justify-center rounded-xl hover:bg-white disabled:opacity-20 transition-all shadow-[0_10px_30px_rgba(0,224,255,0.2)] active:scale-90 group shrink-0"
                >
                  <Send size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all relative overflow-hidden group border ${
          isOpen 
            ? 'bg-surface-dim text-white border-white/20' 
            : 'bg-primary-cyan text-surface-dim border-primary-cyan/50'
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <AnimatePresence mode="wait">
          <motion.div
            key={isOpen ? 'close' : 'open'}
            initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? <X size={20} /> : <Bot size={20} />}
          </motion.div>
        </AnimatePresence>
        {!isOpen && (
          <div className="absolute inset-0 rounded-xl border-2 border-white/40 animate-ping opacity-20" />
        )}
      </motion.button>
    </div>
  );
};


import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity } from 'lucide-react';

interface NotificationProps {
  message: string | null;
}

export const Notification: React.FC<NotificationProps> = ({ message }) => (
  <AnimatePresence>
    {message && (
      <motion.div 
        initial={{ opacity: 0, y: 50, x: '-50%' }}
        animate={{ opacity: 1, y: 0, x: '-50%' }}
        exit={{ opacity: 0, y: 20, x: '-50%' }}
        className="fixed bottom-12 left-1/2 z-[200] bg-surface-dim/90 backdrop-blur-xl border border-primary-cyan/30 px-6 py-3 flex items-center gap-4 shadow-[0_0_30px_rgba(0,255,255,0.2)]"
      >
        <div className="relative">
          <Activity size={16} className="text-primary-cyan" />
          <motion.div 
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-primary-cyan rounded-full"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-[0.3em] text-primary-cyan font-bold leading-none mb-1">System Message</span>
          <span className="text-xs font-mono text-on-surface tracking-tight">{message}</span>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Hand } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';
interface GesturalOverlayProps {
  tableNumber: string;
  currentIndex: number;
  totalItems: number;
}
export function GesturalOverlay({ tableNumber, currentIndex, totalItems }: GesturalOverlayProps) {
  const [showHint, setShowHint] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  useEffect(() => {
    if (hasInteracted) {
      setShowHint(false);
      return;
    }
    const timer = setTimeout(() => {
      if (currentIndex === 0) setShowHint(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, [currentIndex, hasInteracted]);
  useEffect(() => {
    const dismiss = () => setHasInteracted(true);
    window.addEventListener('touchstart', dismiss);
    window.addEventListener('mousedown', dismiss);
    return () => {
      window.removeEventListener('touchstart', dismiss);
      window.removeEventListener('mousedown', dismiss);
    };
  }, []);
  return (
    <div className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-between p-6 sm:p-10 max-w-7xl mx-auto w-full left-1/2 -translate-x-1/2">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex justify-between items-start pointer-events-auto"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white rounded-3xl flex items-center justify-center text-black font-black text-3xl shadow-[0_10px_40px_rgba(255,255,255,0.15)]">
            B
          </div>
          <div>
            <p className="font-black text-[10px] uppercase tracking-[0.3em] text-orange-500">BiteSight</p>
            <p className="font-black text-xl text-white tracking-tight">{tableNumber}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle className="h-14 w-14 rounded-full bg-black/40 backdrop-blur-xl text-white border border-white/10 hover:bg-black/60 shadow-xl" />
        </div>
      </motion.div>
      <div className="flex-1 flex items-center justify-between px-2">
        <div className="w-12 flex justify-start">
          {currentIndex > 0 && (
            <motion.div animate={{ opacity: [0.1, 0.3, 0.1], x: [10, 0, 10] }} transition={{ repeat: Infinity, duration: 2 }}>
              <ChevronLeft className="w-10 h-10 text-white/50" />
            </motion.div>
          )}
        </div>
        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 10 }}
              className="bg-black/80 backdrop-blur-xl px-8 py-4 rounded-full border border-white/10 flex items-center gap-3 shadow-2xl"
            >
              <Hand className="w-5 h-5 text-orange-500 animate-bounce" />
              <span className="text-white font-black text-xs uppercase tracking-[0.2em]">Swipe to Explore</span>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="w-12 flex justify-end">
          {currentIndex < totalItems - 1 && (
            <motion.div animate={{ opacity: [0.1, 0.3, 0.1], x: [-10, 0, -10] }} transition={{ repeat: Infinity, duration: 2 }}>
              <ChevronRight className="w-10 h-10 text-white/50" />
            </motion.div>
          )}
        </div>
      </div>
      <div className="flex justify-center items-end pb-4">
        <div className="pointer-events-auto bg-black/20 backdrop-blur-sm p-3 rounded-full border border-white/5">
           <div className="flex gap-2">
             {Array.from({ length: totalItems }).map((_, i) => (
               <div
                 key={i}
                 className={`h-1.5 rounded-full transition-all duration-500 ${i === currentIndex ? "w-8 bg-orange-600" : "w-2 bg-white/20"}`}
               />
             ))}
           </div>
        </div>
      </div>
    </div>
  );
}
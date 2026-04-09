import React, { useEffect, useState } from 'react';
import { ShoppingCart, ReceiptText, ChevronLeft, ChevronRight, Hand } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useCartStore } from '@/store/useCartStore';
import { motion, AnimatePresence } from 'framer-motion';
interface GesturalOverlayProps {
  tableNumber: string;
  onOpenCart: () => void;
  onOpenHistory: () => void;
  currentIndex: number;
  totalItems: number;
}
export function GesturalOverlay({ tableNumber, onOpenCart, onOpenHistory, currentIndex, totalItems }: GesturalOverlayProps) {
  const items = useCartStore((s) => s.items);
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const placedOrderIds = useCartStore((s) => s.placedOrderIds);
  const [showHint, setShowHint] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentIndex === 0) setShowHint(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, [currentIndex]);
  return (
    <div className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-between p-6 sm:p-10 max-w-7xl mx-auto w-full left-1/2 -translate-x-1/2">
      {/* Top Header */}
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
          {placedOrderIds.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onOpenHistory}
              className="h-14 w-14 rounded-full bg-black/40 backdrop-blur-xl text-white border border-white/10 hover:bg-black/60 shadow-xl"
            >
              <ReceiptText className="w-7 h-7" />
            </Button>
          )}
          <ThemeToggle className="h-14 w-14 rounded-full bg-black/40 backdrop-blur-xl text-white border border-white/10 hover:bg-black/60 shadow-xl" />
        </div>
      </motion.div>
      {/* Navigation Indicators */}
      <div className="flex-1 flex items-center justify-between px-2">
        <div className="w-10">
          {currentIndex > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ repeat: Infinity, duration: 2 }}>
              <ChevronLeft className="w-10 h-10 text-white" />
            </motion.div>
          )}
        </div>
        <AnimatePresence>
          {showHint && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 flex items-center gap-3"
            >
              <Hand className="w-5 h-5 text-orange-400 animate-bounce" />
              <span className="text-white font-black text-xs uppercase tracking-widest">Swipe to Explore</span>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="w-10">
          {currentIndex < totalItems - 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ repeat: Infinity, duration: 2 }}>
              <ChevronRight className="w-10 h-10 text-white" />
            </motion.div>
          )}
        </div>
      </div>
      {/* Bottom Footer */}
      <div className="flex justify-between items-end pb-4">
        <div className="pointer-events-auto bg-black/20 backdrop-blur-sm p-3 rounded-2xl border border-white/5">
           <div className="flex gap-2">
             {Array.from({ length: totalItems }).map((_, i) => (
               <motion.div
                 key={i}
                 initial={false}
                 animate={{ 
                   width: i === currentIndex ? 32 : 8,
                   backgroundColor: i === currentIndex ? "rgba(234, 88, 12, 1)" : "rgba(255, 255, 255, 0.3)" 
                 }}
                 className="h-2 rounded-full transition-all duration-300"
               />
             ))}
           </div>
        </div>
        <div className="pointer-events-auto">
          <Button
            onClick={onOpenCart}
            className="h-24 w-24 rounded-full bg-orange-600 hover:bg-orange-700 shadow-[0_20px_50px_rgba(234,88,12,0.3)] relative transition-all hover:scale-110 active:scale-90 border-4 border-white/10"
          >
            <ShoppingCart className="w-10 h-10 text-white" />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 bg-white text-orange-600 w-10 h-10 rounded-full flex items-center justify-center font-black text-sm border-[6px] border-orange-600 shadow-xl"
                >
                  {cartCount}
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </div>
    </div>
  );
}
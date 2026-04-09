import React from 'react';
import { ShoppingCart, ReceiptText, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const cartItems = useCartStore((s) => s.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const placedOrderIds = useCartStore((s) => s.placedOrderIds);
  return (
    <div className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-between p-6 sm:p-10">
      {/* Top Header Layer */}
      <div className="flex justify-between items-start pointer-events-auto">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-black font-black text-2xl shadow-2xl">
            B
          </div>
          <div className="text-white">
            <p className="font-black text-xs uppercase tracking-widest opacity-60">BiteSight</p>
            <p className="font-black text-lg">{tableNumber}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {placedOrderIds.length > 0 && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onOpenHistory}
              className="h-12 w-12 rounded-full bg-black/20 backdrop-blur-md text-white border border-white/10 hover:bg-black/40"
            >
              <ReceiptText className="w-6 h-6" />
            </Button>
          )}
          <ThemeToggle className="h-12 w-12 rounded-full bg-black/20 backdrop-blur-md text-white border border-white/10 hover:bg-black/40" />
        </div>
      </div>
      {/* Navigation Indicators */}
      <div className="flex-1 flex items-center justify-between opacity-30 px-2">
        <ChevronLeft className={`w-8 h-8 text-white ${currentIndex === 0 ? 'invisible' : 'animate-pulse'}`} />
        <ChevronRight className={`w-8 h-8 text-white ${currentIndex === totalItems - 1 ? 'invisible' : 'animate-pulse'}`} />
      </div>
      {/* Bottom Footer Layer */}
      <div className="flex justify-between items-end">
        <div className="pointer-events-auto">
           <div className="flex gap-1">
             {Array.from({ length: Math.min(totalItems, 8) }).map((_, i) => (
               <div 
                 key={i} 
                 className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-8 bg-orange-500' : 'w-1.5 bg-white/30'}`} 
               />
             ))}
           </div>
        </div>
        <div className="pointer-events-auto">
          <Button
            onClick={onOpenCart}
            className="h-20 w-20 rounded-full bg-orange-600 hover:bg-orange-700 shadow-2xl relative transition-transform active:scale-90"
          >
            <ShoppingCart className="w-8 h-8 text-white" />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-2 -right-2 bg-white text-orange-600 w-8 h-8 rounded-full flex items-center justify-center font-black text-xs border-4 border-orange-600"
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
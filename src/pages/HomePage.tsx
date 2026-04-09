import React, { useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { MenuItem } from '@shared/types';
import { ImmersiveCard } from '@/components/ImmersiveCard';
import { GesturalOverlay } from '@/components/GesturalOverlay';
import { SwipeNavigation } from '@/components/SwipeNavigation';
import { CartSheet } from '@/components/CartSheet';
import { OrderHistorySheet } from '@/components/OrderHistorySheet';
import { Loader2 } from 'lucide-react';
export function HomePage() {
  const [searchParams] = useSearchParams();
  const tableNumber = searchParams.get('table') || 'Table 01';
  const [activeIndex, setActiveIndex] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [direction, setDirection] = useState(0);
  const { data: menuItems = [], isLoading, isError } = useQuery<MenuItem[]>({
    queryKey: ['menu'],
    queryFn: () => api<MenuItem[]>('/api/menu'),
    staleTime: 600000,
  });
  const nextItem = useCallback(() => {
    if (activeIndex < menuItems.length - 1) {
      setDirection(1);
      setActiveIndex((prev) => prev + 1);
    }
  }, [activeIndex, menuItems.length]);
  const prevItem = useCallback(() => {
    if (activeIndex > 0) {
      setDirection(-1);
      setActiveIndex((prev) => prev - 1);
    }
  }, [activeIndex]);
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.9,
    })
  };
  if (isLoading) {
    return (
      <div className="h-[100dvh] flex items-center justify-center bg-black">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <Loader2 className="w-10 h-10 text-orange-500" />
        </motion.div>
      </div>
    );
  }
  if (isError || menuItems.length === 0) {
    return (
      <div className="h-[100dvh] flex flex-col items-center justify-center bg-zinc-950 p-6 text-center">
        <h2 className="text-2xl font-black text-white mb-2">Menu Unavailable</h2>
        <p className="text-zinc-400 max-w-xs">The kitchen might be closed or the signal is weak. Try refreshing.</p>
      </div>
    );
  }
  const currentItem = menuItems[activeIndex];
  return (
    <div className="h-[100dvh] w-full bg-black overflow-hidden relative touch-none">
      <SwipeNavigation onSwipeLeft={nextItem} onSwipeRight={prevItem}>
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={activeIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.3 },
              scale: { duration: 0.4 }
            }}
            className="absolute inset-0 h-full w-full"
          >
            <ImmersiveCard item={currentItem} />
          </motion.div>
        </AnimatePresence>
      </SwipeNavigation>
      <GesturalOverlay
        tableNumber={tableNumber}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        currentIndex={activeIndex}
        totalItems={menuItems.length}
      />
      <CartSheet
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        tableNumber={tableNumber}
      />
      <OrderHistorySheet
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />
    </div>
  );
}
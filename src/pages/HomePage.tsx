import React, { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { MenuItem } from '@shared/types';
import { ImmersiveCard } from '@/components/ImmersiveCard';
import { GesturalOverlay } from '@/components/GesturalOverlay';
import { SwipeNavigation } from '@/components/SwipeNavigation';
export function HomePage() {
  const [searchParams] = useSearchParams();
  const tableNumber = searchParams.get('table') || 'Table 01';
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const { data: menuItems = [], isLoading, isError, refetch } = useQuery<MenuItem[]>({
    queryKey: ['menu'],
    queryFn: () => api<MenuItem[]>('/api/menu'),
    staleTime: 600000,
  });
  useEffect(() => {
    if (menuItems.length === 0) return;
    const preload = (index: number) => {
      const item = menuItems[index];
      if (item?.glbUrl) {
        if (!document.querySelector(`link[href="${item.glbUrl}"]`)) {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'fetch';
          link.href = item.glbUrl;
          link.crossOrigin = 'anonymous';
          document.head.appendChild(link);
        }
      }
    };
    if (activeIndex < menuItems.length - 1) preload(activeIndex + 1);
    if (activeIndex > 0) preload(activeIndex - 1);
  }, [activeIndex, menuItems]);
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
      scale: 0.95,
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
      scale: 0.95,
    })
  };
  if (isLoading) {
    return (
      <div className="h-[100dvh] flex items-center justify-center bg-black text-white">
        <div className="flex flex-col items-center gap-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="w-16 h-16 border-4 border-orange-500/20 border-t-orange-500 rounded-full"
          />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500 animate-pulse">
            Setting the Table
          </p>
        </div>
      </div>
    );
  }
  if (isError || menuItems.length === 0) {
    return (
      <div className="h-[100dvh] flex flex-col items-center justify-center bg-zinc-950 p-6 text-center">
        <h2 className="text-2xl font-black text-white mb-2">Menu Unavailable</h2>
        <button
          onClick={() => refetch()}
          className="bg-white text-black px-8 py-3 rounded-full font-black text-sm uppercase tracking-widest active:scale-95 transition-all"
        >
          Try Again
        </button>
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
              x: { type: "spring", stiffness: 350, damping: 35 },
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
        currentIndex={activeIndex}
        totalItems={menuItems.length}
      />
    </div>
  );
}
import React from 'react';
import { motion, PanInfo } from 'framer-motion';
interface SwipeNavigationProps {
  children: React.ReactNode;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}
export function SwipeNavigation({ children, onSwipeLeft, onSwipeRight }: SwipeNavigationProps) {
  const handlePanEnd = (_: any, info: PanInfo) => {
    const threshold = 50;
    const velocityThreshold = 500;
    if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
      onSwipeLeft();
    } else if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
      onSwipeRight();
    }
  };
  return (
    <motion.div
      onPanEnd={handlePanEnd}
      className="h-full w-full touch-none select-none overflow-hidden relative"
    >
      {children}
    </motion.div>
  );
}
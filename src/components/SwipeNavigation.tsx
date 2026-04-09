import React, { useCallback, ReactNode } from 'react';
import { motion, PanInfo } from 'framer-motion';
interface SwipeNavigationProps {
  children: ReactNode;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  setPanning: (panning: boolean) => void;
}
export function SwipeNavigation({ children, onSwipeLeft, onSwipeRight, setPanning }: SwipeNavigationProps) {
  const handlePanEnd = useCallback((_: any, info: PanInfo) => {
    const threshold = 40; // Lower threshold for better sensitivity
    const velocityThreshold = 500; // Lower velocity threshold for flick gestures
    if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
      onSwipeLeft();
    } else if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
      onSwipeRight();
    }
  }, [onSwipeLeft, onSwipeRight]);
  return (
    <motion.div
      onPanStart={() => setPanning(true)}
      onPanEnd={(e, info) => {
        handlePanEnd(e, info);
        setPanning(false);
      }}
      className="h-full w-full touch-none select-none overflow-hidden relative"
    >
      {children}
    </motion.div>
  );
}
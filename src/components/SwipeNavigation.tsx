import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, PanInfo } from 'framer-motion';

export const SwipePanContext = createContext<{ isPanning: boolean } | null>(null);
interface SwipeNavigationProps {
  children: ReactNode;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}
export function SwipeNavigation({ children, onSwipeLeft, onSwipeRight }: SwipeNavigationProps) {
  const [isPanning, setIsPanning] = useState(false);

  const handlePanEnd = useCallback((_: any, info: PanInfo) => {
    const threshold = 50;
    const velocityThreshold = 800; // increase for fast spin detect
    if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
      onSwipeLeft();
    } else if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
      onSwipeRight();
    }
  }, [onSwipeLeft, onSwipeRight]);
  return (
    <motion.div
      onPanStart={() => setIsPanning(true)}
      onPanEnd={(e, info) => {
        handlePanEnd(e, info);
        setIsPanning(false);
      }}
      className="h-full w-full touch-none select-none overflow-hidden relative"
    >
      <SwipePanContext.Provider value={{ isPanning }}>
        {children}
      </SwipePanContext.Provider>
    </motion.div>
  );
}
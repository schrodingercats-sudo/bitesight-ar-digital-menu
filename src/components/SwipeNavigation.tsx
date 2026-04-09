import React from 'react';
import { useSwipeable } from 'react-swipeable';
interface SwipeNavigationProps {
  children: React.ReactNode;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}
export function SwipeNavigation({ children, onSwipeLeft, onSwipeRight }: SwipeNavigationProps) {
  const handlers = useSwipeable({
    onSwipedLeft: () => onSwipeLeft(),
    onSwipedRight: () => onSwipeRight(),
    preventScrollOnSwipe: true,
    trackMouse: true,
    delta: 50,
  });
  return (
    <div {...handlers} className="h-full w-full touch-none select-none">
      {children}
    </div>
  );
}
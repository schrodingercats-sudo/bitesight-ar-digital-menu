import React, { useState, useMemo, useContext } from 'react';
import { SwipePanContext } from './SwipePanContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Utensils, Search } from 'lucide-react';
import type { MenuItem } from '@shared/types';
import { MenuItemCard } from './MenuItemCard';
import { MOCK_CATEGORIES } from '@shared/mock-data';
import { Button } from '@/components/ui/button';
interface FullMenuViewProps {
  items: MenuItem[];
  onSelectItem: (id: string) => void;
  onClose: () => void;
}
export function FullMenuView({ items, onSelectItem, onClose }: FullMenuViewProps) {
  const { isPanning } = useContext(SwipePanContext);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const categories = useMemo(() => ['All', ...MOCK_CATEGORIES], []);
  const filteredItems = useMemo(() => {
    if (selectedCategory === 'All') return items;
    return items.filter(item => item.category === selectedCategory);
  }, [items, selectedCategory]);
  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 250 }}
      className={`absolute inset-0 ${isPanning ? 'z-0 opacity-0 pointer-events-none' : 'z-[100]'} bg-zinc-950 flex flex-col overflow-hidden`}
    >
      {/* Header */}
      <div className="px-6 pt-16 pb-6 border-b border-white/5 bg-zinc-950/80 backdrop-blur-2xl">
        <div className="flex justify-between items-end mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Search className="w-3 h-3 text-orange-500" />
              <p className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.4em]">Browse Menu</p>
            </div>
            <h2 className="text-5xl font-black tracking-tighter text-white leading-none">DISCOVER</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full bg-white/5 h-14 w-14 text-white hover:bg-white/10 active:scale-90 transition-transform"
          >
            <X className="w-8 h-8" />
          </Button>
        </div>
        {/* Categories Bar */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar -mx-2 px-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-7 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-orange-600 text-white shadow-lg scale-105'
                  : 'bg-white/5 text-zinc-500 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      {/* Grid Content */}
      <div className="flex-1 overflow-y-auto px-6 py-8 pb-32 no-scrollbar">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectItem(item.id)}
                className="transform transition-all active:scale-[0.98]"
              >
                <MenuItemCard
                  item={item}
                  onViewDetails={() => onSelectItem(item.id)}
                />
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
        {filteredItems.length === 0 && (
          <div className="h-64 flex flex-col items-center justify-center text-zinc-800 space-y-4">
            <Utensils className="w-16 h-16 opacity-10" />
            <p className="font-black text-[10px] uppercase tracking-[0.3em]">No dishes found</p>
          </div>
        )}
      </div>
      {/* Bottom Safe Area Decoration */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none" />
    </motion.div>
  );
}
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Utensils } from 'lucide-react';
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
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-[100] bg-zinc-950 flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 pt-16 pb-6 border-b border-white/5 bg-zinc-950/50 backdrop-blur-xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-4xl font-black tracking-tighter text-white">DISCOVER</h2>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Full Collection</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full bg-white/5 h-12 w-12 text-white hover:bg-white/10 active:scale-90"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>
        {/* Categories Scroller */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar -mx-2 px-2 scroll-smooth">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                selectedCategory === cat
                  ? 'bg-orange-600 text-white shadow-[0_0_20px_rgba(234,88,12,0.4)]'
                  : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      {/* Grid Content */}
      <div className="flex-1 overflow-y-auto px-6 py-8 pb-32">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectItem(item.id)}
                className="cursor-pointer"
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
          <div className="h-64 flex flex-col items-center justify-center text-zinc-700 space-y-4">
            <Utensils className="w-12 h-12 opacity-20" />
            <p className="font-black text-[10px] uppercase tracking-widest">Kitchen is empty</p>
          </div>
        )}
      </div>
      {/* Bottom Visual Gradient */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none" />
    </motion.div>
  );
}
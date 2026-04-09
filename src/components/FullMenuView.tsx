import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Utensils } from 'lucide-react';
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
            <p className="text-zinc-500 text-xs font-black uppercase tracking-widest">Our Complete Menu</p>
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
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar -mx-2 px-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                selectedCategory === cat
                  ? 'bg-orange-600 text-white'
                  : 'bg-white/5 text-zinc-400 hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      {/* Grid Content */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, x: 20, rotateY: 10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            exit={{ opacity: 0, x: -20, rotateY: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredItems.map((item, idx) => (
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
          <div className="h-64 flex flex-col items-center justify-center text-zinc-500 space-y-4">
            <Utensils className="w-12 h-12 opacity-20" />
            <p className="font-black text-xs uppercase tracking-widest">No items found</p>
          </div>
        )}
      </div>
      {/* Footer Decoration */}
      <div className="p-6 bg-gradient-to-t from-black to-transparent pointer-events-none">
        <div className="h-1 w-12 bg-zinc-800 mx-auto rounded-full mb-4" />
      </div>
    </motion.div>
  );
}
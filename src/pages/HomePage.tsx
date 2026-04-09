import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Search, Menu as MenuIcon, ReceiptText, ChevronDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MOCK_CATEGORIES } from '@shared/mock-data';
import type { MenuItem } from '@shared/types';
import { MenuItemCard } from '@/components/MenuItemCard';
import { ItemDetailsDrawer } from '@/components/ItemDetailsDrawer';
import { CartSheet } from '@/components/CartSheet';
import { OrderHistorySheet } from '@/components/OrderHistorySheet';
import { MenuSkeleton } from '@/components/MenuSkeleton';
import { useCartStore } from '@/store/useCartStore';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';
import { api } from '@/lib/api-client';
export function HomePage() {
  const [searchParams] = useSearchParams();
  const tableNumber = searchParams.get('table') || 'Table 01';
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeItem, setActiveItem] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const cartItems = useCartStore((s) => s.items);
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const placedOrderIds = useCartStore((s) => s.placedOrderIds);
  const { data: menuItems = [], isLoading, isError } = useQuery<MenuItem[]>({
    queryKey: ['menu'],
    queryFn: () => api<MenuItem[]>('/api/menu'),
  });
  const categories = ['All', ...MOCK_CATEGORIES];
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [menuItems, selectedCategory, searchQuery]);
  return (
    <div className="min-h-screen bg-[#FAFAF9] dark:bg-[#09090b] flex flex-col selection:bg-orange-100 selection:text-orange-900">
      <header className="sticky top-0 z-50 bg-background/70 backdrop-blur-xl border-b border-border/50 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#EA580C] to-[#C2410C] flex items-center justify-center text-white font-black text-xl shadow-lg shadow-orange-500/20">B</div>
            <div className="hidden xs:block">
              <h1 className="font-display font-black text-xl tracking-tighter leading-none">BiteSight</h1>
              <span className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">{tableNumber}</span>
            </div>
          </div>
          <div className="flex-1 max-w-md relative hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search for your favorite dish..."
              className="pl-11 h-11 rounded-full border-border/50 bg-muted/40 focus-visible:ring-primary/20 focus-visible:bg-background transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle className="hover:bg-muted" />
            <div className="h-8 w-[1px] bg-border/50 hidden sm:block" />
            <Button variant="ghost" size="icon" className="md:hidden hover:bg-muted">
              <MenuIcon className="w-5 h-5" />
            </Button>
            <div className="hidden md:flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground bg-muted px-3 py-1.5 rounded-full border border-border/50">
                Table {tableNumber.split(' ').pop()}
              </span>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-32">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center sm:text-left"
        >
          <h2 className="text-4xl sm:text-5xl font-display font-black tracking-tight text-foreground mb-3">Dine in 3D.</h2>
          <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl">
            Experience our artisanal menu through immersive augmented reality. 
            Select a dish to see it on your table.
          </p>
        </motion.div>
        <div className="md:hidden mb-8">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <Input
              placeholder="Search dishes..."
              className="pl-11 h-14 rounded-2xl bg-white dark:bg-zinc-900 border-border/50 shadow-sm focus-visible:ring-primary/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="sticky top-16 sm:top-20 z-40 -mx-4 px-4 sm:mx-0 sm:px-0 mb-10 overflow-hidden">
          <div className="flex overflow-x-auto pb-4 gap-2 no-scrollbar pt-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-6 py-2.5 rounded-full whitespace-nowrap text-sm font-bold transition-all border shadow-sm",
                  selectedCategory === cat
                    ? "bg-[#EA580C] text-white border-orange-600 shadow-orange-500/20 scale-105"
                    : "bg-white dark:bg-zinc-900 text-muted-foreground border-border/50 hover:border-border hover:bg-zinc-50 dark:hover:bg-zinc-800"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {[...Array(8)].map((_, i) => (
              <MenuSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-20 bg-destructive/5 rounded-3xl border-2 border-dashed border-destructive/20">
            <p className="text-destructive font-bold text-lg">Oops! Something went wrong.</p>
            <p className="text-muted-foreground">We couldn't load the menu. Please refresh the page.</p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <MenuItemCard
                      item={item}
                      onViewDetails={(item) => setActiveItem(item)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            {filteredItems.length === 0 && (
              <div className="text-center py-32 bg-muted/20 rounded-3xl border-2 border-dashed border-border/50">
                <p className="text-muted-foreground text-lg font-medium">No dishes match your search.</p>
                <Button variant="link" onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}>Clear filters</Button>
              </div>
            )}
          </>
        )}
      </main>
      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4">
        {placedOrderIds.length > 0 && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
            <Button
              onClick={() => setIsHistoryOpen(true)}
              className="h-14 w-14 rounded-full bg-white dark:bg-zinc-900 text-foreground hover:bg-zinc-50 dark:hover:bg-zinc-800 shadow-2xl flex items-center justify-center p-0 border border-border/50 transition-transform active:scale-90"
            >
              <ReceiptText className="w-6 h-6" />
            </Button>
          </motion.div>
        )}
        <Button
          onClick={() => setIsCartOpen(true)}
          className="h-20 w-20 rounded-full bg-[#EA580C] hover:bg-[#C2410C] shadow-[0_20px_50px_-15px_rgba(234,88,12,0.5)] flex items-center justify-center p-0 transition-all hover:scale-110 active:scale-90"
        >
          <div className="relative">
            <ShoppingCart className="w-8 h-8 text-white" />
            <AnimatePresence>
              {cartItemCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-3 -right-3 bg-white text-[#EA580C] w-7 h-7 flex items-center justify-center rounded-full p-0 border-4 border-[#EA580C] font-black text-xs"
                >
                  {cartItemCount}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Button>
      </div>
      <ItemDetailsDrawer
        item={activeItem}
        isOpen={!!activeItem}
        onClose={() => setActiveItem(null)}
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
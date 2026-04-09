import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Search, Menu as MenuIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MOCK_CATEGORIES } from '@shared/mock-data';
import type { MenuItem } from '@shared/types';
import { MenuItemCard } from '@/components/MenuItemCard';
import { ItemDetailsDrawer } from '@/components/ItemDetailsDrawer';
import { CartSheet } from '@/components/CartSheet';
import { MenuSkeleton } from '@/components/MenuSkeleton';
import { useCartStore } from '@/store/useCartStore';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';
import { api } from '@/lib/api-client';
export function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeItem, setActiveItem] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartItems = useCartStore((s) => s.items);
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
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
    <div className="min-h-screen bg-[#FAFAF9] dark:bg-[#18181B] flex flex-col">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#EA580C] flex items-center justify-center text-white font-bold">B</div>
            <h1 className="font-display font-bold text-xl tracking-tight hidden sm:block">BiteSight</h1>
          </div>
          <div className="flex-1 max-w-sm mx-4 relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search dishes..."
              className="pl-10 h-10 rounded-full border-none bg-muted/50 focus-visible:ring-primary/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle className="relative top-0 right-0" />
            <Button variant="ghost" size="icon" className="md:hidden">
              <MenuIcon className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8 mt-2">
          <h2 className="text-3xl font-display font-bold text-foreground">Dine in 3D</h2>
          <p className="text-muted-foreground">Scan your table to see your food before you order.</p>
        </div>
        <div className="md:hidden mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search favorite dishes..."
            className="pl-10 h-12 rounded-xl bg-white dark:bg-zinc-900 border-none shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex overflow-x-auto pb-4 gap-2 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-medium transition-all",
                selectedCategory === cat
                  ? "bg-[#EA580C] text-white shadow-md shadow-orange-500/20"
                  : "bg-white dark:bg-zinc-900 text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <MenuSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-20 bg-muted/20 rounded-2xl">
            <p className="text-destructive font-medium">Failed to load menu items. Please try again.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
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
              <div className="text-center py-20">
                <p className="text-muted-foreground">No dishes found matching your criteria.</p>
              </div>
            )}
          </>
        )}
      </main>
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          onClick={() => setIsCartOpen(true)}
          className="h-16 w-16 rounded-full bg-[#EA580C] hover:bg-[#C2410C] shadow-2xl flex items-center justify-center p-0 transition-transform active:scale-90"
        >
          <div className="relative">
            <ShoppingCart className="w-7 h-7 text-white" />
            {cartItemCount > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-white text-[#EA580C] hover:bg-white w-6 h-6 flex items-center justify-center rounded-full p-0 border-2 border-[#EA580C] font-bold">
                {cartItemCount}
              </Badge>
            )}
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
      />
    </div>
  );
}
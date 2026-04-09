import React from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { ARModelViewer } from './ARModelViewer';
import type { MenuItem } from '@shared/types';
import { useCartStore } from '@/store/useCartStore';
import { Minus, Plus, ShoppingBag } from 'lucide-react';
interface ItemDetailsDrawerProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
}
export function ItemDetailsDrawer({ item, isOpen, onClose }: ItemDetailsDrawerProps) {
  const addItem = useCartStore((s) => s.addItem);
  const itemsInCart = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  if (!item) return null;
  const cartItem = itemsInCart.find((i) => i.id === item.id);
  const quantity = cartItem?.quantity ?? 0;
  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="max-h-[95dvh] md:max-h-[85dvh]">
        <div className="mx-auto w-full max-w-2xl overflow-y-auto px-6 pb-12 sm:pb-8">
          <DrawerHeader className="px-0 pt-8 sm:pt-10">
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-1">
                <DrawerTitle className="text-3xl font-black tracking-tighter sm:text-4xl">{item.name}</DrawerTitle>
                <DrawerDescription className="text-lg font-medium text-orange-600">
                  {item.category} • ${item.price.toFixed(2)}
                </DrawerDescription>
              </div>
            </div>
          </DrawerHeader>
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 py-6">
            <div className="w-full">
              {item.glbUrl ? (
                <ARModelViewer src={item.glbUrl} alt={item.name} poster={item.imageUrl} />
              ) : (
                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-muted border border-border/50 shadow-inner">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover transition-transform hover:scale-105 duration-700" />
                </div>
              )}
            </div>
            <div className="space-y-6">
              <div className="space-y-3">
                <h4 className="font-bold text-xl tracking-tight">Chef's Description</h4>
                <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
                  {item.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {item.dietaryTags.map((tag) => (
                  <span key={tag} className="bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400 px-4 py-1.5 rounded-full text-xs font-bold border border-orange-100 dark:border-orange-900/30">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <DrawerFooter className="px-0 pt-8 mt-6 border-t border-border/50 sticky bottom-0 bg-background/80 backdrop-blur-md pb-6 sm:pb-4">
            <div className="flex items-center justify-between gap-4 w-full">
              {quantity > 0 ? (
                <div className="flex items-center gap-6 bg-muted/60 border border-border/50 rounded-full p-1.5 h-16 flex-1 max-w-md mx-auto">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-12 w-12 hover:bg-background shadow-sm transition-all"
                    onClick={() => updateQuantity(item.id, -1)}
                  >
                    <Minus className="w-5 h-5" />
                  </Button>
                  <span className="font-black text-2xl w-10 text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-12 w-12 hover:bg-background shadow-sm transition-all"
                    onClick={() => updateQuantity(item.id, 1)}
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>
              ) : (
                <Button
                  className="flex-1 h-16 rounded-full text-xl font-black bg-[#EA580C] hover:bg-[#C2410C] shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02] active:scale-95 max-w-md mx-auto"
                  onClick={() => addItem(item)}
                >
                  <ShoppingBag className="mr-3 h-6 w-6" />
                  Add to Cart
                </Button>
              )}
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
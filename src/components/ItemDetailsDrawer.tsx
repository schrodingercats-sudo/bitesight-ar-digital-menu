import React from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { ARModelViewer } from './ARModelViewer';
import type { MenuItem } from '@shared/types';
import { useOrderStore } from '@/store/useOrderStore';
import { Minus, Plus, ShoppingBag } from 'lucide-react';
interface ItemDetailsDrawerProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
}
export function ItemDetailsDrawer({ item, isOpen, onClose }: ItemDetailsDrawerProps) {
  const addToOrder = useOrderStore((s) => s.addToOrder);
  const items = useOrderStore((s) => s.items);
  const updateQuantity = useOrderStore((s) => s.updateQuantity);
  if (!item) return null;
  const cartItem = items.find((i) => i.id === item.id);
  const quantity = cartItem?.quantity ?? 0;
  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="max-h-[95dvh] md:max-h-[85dvh]">
        <div className="mx-auto w-full max-w-2xl overflow-y-auto px-6 pb-12 sm:pb-8">
          <DrawerHeader className="px-0 pt-8">
            <DrawerTitle className="text-3xl font-black tracking-tighter sm:text-4xl">{item.name}</DrawerTitle>
            <DrawerDescription className="text-lg font-medium text-orange-600">
              {item.category} • ${item.price.toFixed(2)}
            </DrawerDescription>
          </DrawerHeader>
          <div className="py-6">
            {item.glbUrl ? (
              <ARModelViewer src={item.glbUrl} alt={item.name} poster={item.imageUrl} />
            ) : (
              <img src={item.imageUrl} alt={item.name} className="w-full aspect-video rounded-2xl object-cover" />
            )}
            <div className="mt-6 space-y-6">
              <h4 className="font-bold text-xl">Chef's Description</h4>
              <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              <div className="flex flex-wrap gap-2">
                {item.dietaryTags.map((tag) => (
                  <span key={tag} className="bg-orange-50 dark:bg-orange-950/20 text-orange-700 px-4 py-1.5 rounded-full text-xs font-bold border border-orange-100">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <DrawerFooter className="px-0 pt-8 sticky bottom-0 bg-background/80 backdrop-blur-md pb-6">
            {quantity > 0 ? (
              <div className="flex items-center gap-6 bg-muted/60 border border-border/50 rounded-full p-1.5 h-16 w-full max-w-md mx-auto">
                <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full" onClick={() => updateQuantity(item.id, -1)}><Minus className="w-5 h-5" /></Button>
                <span className="font-black text-2xl w-10 text-center">{quantity}</span>
                <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full" onClick={() => updateQuantity(item.id, 1)}><Plus className="w-5 h-5" /></Button>
              </div>
            ) : (
              <Button className="h-16 w-full rounded-full text-xl font-black bg-orange-600 hover:bg-orange-700 max-w-md mx-auto" onClick={() => addToOrder(item)}>
                <ShoppingBag className="mr-3 h-6 w-6" /> Add to Order
              </Button>
            )}
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
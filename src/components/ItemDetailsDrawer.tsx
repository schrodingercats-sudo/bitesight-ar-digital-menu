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
      <DrawerContent className="max-h-[90dvh]">
        <div className="mx-auto w-full max-w-lg overflow-y-auto px-6 pb-8">
          <DrawerHeader className="px-0">
            <DrawerTitle className="text-2xl font-bold">{item.name}</DrawerTitle>
            <DrawerDescription className="text-base">
              {item.category} • ${item.price.toFixed(2)}
            </DrawerDescription>
          </DrawerHeader>
          <div className="space-y-6">
            {item.glbUrl ? (
              <ARModelViewer src={item.glbUrl} alt={item.name} />
            ) : (
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-muted">
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Description</h4>
              <p className="text-muted-foreground leading-relaxed">
                {item.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {item.dietaryTags.map((tag) => (
                  <span key={tag} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-medium border">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <DrawerFooter className="px-0 pt-8 mt-4 border-t sticky bottom-0 bg-background">
            <div className="flex items-center justify-between gap-4">
              {quantity > 0 ? (
                <div className="flex items-center gap-4 bg-muted rounded-full p-1 h-12 flex-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full h-10 w-10 hover:bg-background"
                    onClick={() => updateQuantity(item.id, -1)}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="font-bold text-lg w-8 text-center">{quantity}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full h-10 w-10 hover:bg-background"
                    onClick={() => updateQuantity(item.id, 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button 
                  className="flex-1 h-12 rounded-full text-lg font-bold bg-[#EA580C] hover:bg-[#C2410C]"
                  onClick={() => addItem(item)}
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
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
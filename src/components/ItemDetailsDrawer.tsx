import React from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { ARModelViewer } from './ARModelViewer';
import type { MenuItem } from '@shared/types';
import { X } from 'lucide-react';
interface ItemDetailsDrawerProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
}
export function ItemDetailsDrawer({ item, isOpen, onClose }: ItemDetailsDrawerProps) {
  if (!item) return null;
  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="max-h-[95dvh] md:max-h-[85dvh]">
        <div className="mx-auto w-full max-w-2xl overflow-y-auto px-6 pb-12 sm:pb-8">
          <DrawerHeader className="px-0 pt-8 relative">
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-0 top-8 rounded-full" 
              onClick={onClose}
            >
              <X className="h-6 w-6" />
            </Button>
            <DrawerTitle className="text-3xl font-black tracking-tighter sm:text-4xl pr-12">{item.name}</DrawerTitle>
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
            <Button variant="outline" className="h-16 w-full rounded-full text-xl font-black border-2 border-orange-600 text-orange-600 hover:bg-orange-50" onClick={onClose}>
              Back to Menu
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Info } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { MenuItem } from '@shared/types';
import { useCartStore } from '@/store/useCartStore';
interface MenuItemCardProps {
  item: MenuItem;
  onViewDetails: (item: MenuItem) => void;
}
export function MenuItemCard({ item, onViewDetails }: MenuItemCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="h-full"
    >
      <Card className="overflow-hidden h-full flex flex-col border-none shadow-soft hover:shadow-lg transition-all duration-300">
        <div 
          className="aspect-video overflow-hidden relative cursor-pointer"
          onClick={() => onViewDetails(item)}
        >
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
          {item.glbUrl && (
            <Badge className="absolute top-2 right-2 bg-primary/90 backdrop-blur-sm text-2xs uppercase tracking-wider">
              3D available
            </Badge>
          )}
        </div>
        <CardContent className="p-4 flex-1">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg leading-tight text-foreground">{item.name}</h3>
            <span className="font-bold text-primary">${item.price.toFixed(2)}</span>
          </div>
          <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
            {item.description}
          </p>
          <div className="flex flex-wrap gap-1">
            {item.dietaryTags.map((tag) => (
              <span key={tag} className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 text-xs"
            onClick={() => onViewDetails(item)}
          >
            <Info className="w-3 h-3 mr-1" />
            Details
          </Button>
          <Button 
            size="sm" 
            className="flex-1 bg-gradient-to-r from-[#EA580C] to-[#C2410C] border-none text-xs"
            onClick={() => addItem(item)}
          >
            <Plus className="w-3 h-3 mr-1" />
            Add
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
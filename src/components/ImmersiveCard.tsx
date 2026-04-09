import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, X, Star, Sparkles } from 'lucide-react';
import type { MenuItem } from '@shared/types';
import { ARModelViewer } from './ARModelViewer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/store/useCartStore';
interface ImmersiveCardProps {
  item: MenuItem;
}
export function ImmersiveCard({ item }: ImmersiveCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  return (
    <div className="relative h-full w-full bg-zinc-950 text-white overflow-hidden">
      {/* Background Media */}
      <div className="absolute inset-0 z-0">
        {item.glbUrl ? (
          <ARModelViewer 
            src={item.glbUrl} 
            alt={item.name} 
            poster={item.imageUrl} 
            className="w-full h-full border-none rounded-none"
          />
        ) : (
          <div className="w-full h-full relative">
            <img 
              src={item.imageUrl} 
              alt={item.name} 
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          </div>
        )}
      </div>
      {/* Content Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end pointer-events-none">
        <div className="p-8 sm:p-12 space-y-4 max-w-2xl pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-none text-[10px] font-black uppercase tracking-widest px-3">
                {item.category}
              </Badge>
              {item.glbUrl && (
                <Badge variant="outline" className="text-white border-white/30 text-[10px] flex gap-1">
                  <Sparkles className="w-3 h-3" /> 3D
                </Badge>
              )}
            </div>
            <h2 className="text-5xl sm:text-7xl font-display font-black tracking-tighter leading-none mb-2">
              {item.name}
            </h2>
            <p className="text-2xl font-bold text-orange-500 mb-6">
              ${item.price.toFixed(2)}
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-3"
          >
            <Button 
              size="lg" 
              className="h-16 px-10 rounded-full bg-white text-black hover:bg-zinc-200 font-black text-lg transition-transform active:scale-95 flex-1 sm:flex-none"
              onClick={() => addItem(item)}
            >
              Add to Order
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-16 w-16 rounded-full border-white/20 bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all"
              onClick={() => setShowDetails(true)}
            >
              <Info className="w-6 h-6" />
            </Button>
          </motion.div>
        </div>
      </div>
      {/* Details Overlay Panel */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 z-40 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-6"
          >
            <div className="max-w-md w-full space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-3xl font-black">Chef's Notes</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowDetails(false)}>
                  <X className="w-8 h-8" />
                </Button>
              </div>
              <p className="text-xl text-zinc-400 leading-relaxed font-medium">
                {item.description}
              </p>
              <div className="space-y-4">
                <h4 className="text-sm font-black uppercase tracking-widest text-orange-500">Dietary Profile</h4>
                <div className="flex flex-wrap gap-2">
                  {item.dietaryTags.map(tag => (
                    <Badge key={tag} className="bg-zinc-800 text-zinc-300 py-2 px-4 rounded-xl border-zinc-700">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full h-14 rounded-2xl border-white/20 font-bold"
                onClick={() => setShowDetails(false)}
              >
                Back to View
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
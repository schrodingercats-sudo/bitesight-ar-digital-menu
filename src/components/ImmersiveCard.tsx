import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, X, Sparkles, ChefHat } from 'lucide-react';
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
    <div className="relative h-full w-full bg-black text-white overflow-hidden">
      {/* Background Media Container */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          {item.glbUrl ? (
            <motion.div 
              key="ar-viewer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full"
            >
              <ARModelViewer
                src={item.glbUrl}
                alt={item.name}
                poster={item.imageUrl}
                className="w-full h-full border-none rounded-none bg-transparent"
              />
            </motion.div>
          ) : (
            <motion.div 
              key="static-img"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full relative"
            >
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover scale-105 blur-sm opacity-40 absolute inset-0"
              />
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover relative z-10"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-20" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* Content Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end pointer-events-none">
        <div className="p-8 sm:p-12 pb-24 sm:pb-32 space-y-4 max-w-2xl pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-orange-600 hover:bg-orange-600 text-white border-none text-[10px] font-black uppercase tracking-widest px-3 py-1">
                {item.category}
              </Badge>
              {item.glbUrl && (
                <Badge variant="outline" className="text-white border-white/40 bg-white/5 backdrop-blur-md text-[10px] flex gap-1.5 py-1">
                  <Sparkles className="w-3 h-3 text-orange-400" /> 3D EXPERIENCE
                </Badge>
              )}
            </div>
            <h2 className="text-5xl sm:text-8xl font-display font-black tracking-tighter leading-[0.85] mb-4">
              {item.name}
            </h2>
            <p className="text-3xl font-black text-orange-500 drop-shadow-2xl">
              ${item.price.toFixed(2)}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-4"
          >
            <motion.div 
              className="flex-1 sm:flex-none"
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              <Button
                size="lg"
                className="h-16 w-full sm:w-auto px-12 rounded-full bg-white text-black hover:bg-zinc-100 font-black text-xl shadow-[0_0_30px_rgba(255,255,255,0.2)] active:scale-95 transition-all"
                onClick={() => addItem(item)}
              >
                Add to Order
              </Button>
            </motion.div>
            <Button
              variant="outline"
              size="icon"
              className="h-16 w-16 rounded-full border-white/20 bg-black/40 backdrop-blur-xl hover:bg-white/10 transition-all group"
              onClick={() => setShowDetails(true)}
            >
              <Info className="w-7 h-7 group-hover:scale-110 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </div>
      {/* Details Overlay Panel */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="absolute inset-0 z-50 bg-black/60 backdrop-blur-3xl flex items-center justify-center p-6"
          >
            <div className="max-w-md w-full space-y-10 relative">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <ChefHat className="w-8 h-8 text-orange-500" />
                  <h3 className="text-4xl font-black tracking-tighter">The Details</h3>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setShowDetails(false)}
                  className="rounded-full bg-white/10 hover:bg-white/20"
                >
                  <X className="w-8 h-8" />
                </Button>
              </div>
              <div className="space-y-4">
                <p className="text-2xl text-zinc-300 leading-tight font-bold text-pretty">
                  {item.description}
                </p>
              </div>
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-orange-500">Dietary Profile</h4>
                <div className="flex flex-wrap gap-2.5">
                  {item.dietaryTags.map(tag => (
                    <Badge key={tag} className="bg-zinc-800/80 text-zinc-100 py-2.5 px-5 rounded-2xl border-zinc-700 text-sm font-bold">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full h-16 rounded-3xl border-white/20 bg-white/5 font-black text-lg hover:bg-white/10"
                onClick={() => setShowDetails(false)}
              >
                Return to View
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
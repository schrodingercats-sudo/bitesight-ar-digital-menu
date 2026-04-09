import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, X, Sparkles, ChefHat, Check, ShoppingBag } from 'lucide-react';
import type { MenuItem } from '@shared/types';
import { ARModelViewer } from './ARModelViewer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useOrderStore } from '@/store/useOrderStore';
interface ImmersiveCardProps {
  item: MenuItem;
}
export function ImmersiveCard({ item }: ImmersiveCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const addToOrder = useOrderStore((s) => s.addToOrder);
  const handleAdd = () => {
    setIsAdding(true);
    addToOrder(item);
    setTimeout(() => setIsAdding(false), 2000);
  };
  return (
    <div className="relative h-full w-full bg-black text-white overflow-hidden">
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          {item.glbUrl ? (
            <motion.div
              key="ar-viewer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-4xl mx-auto my-auto h-[80vh] md:h-[60vh] flex items-center justify-center"
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
              className="w-full max-w-4xl mx-auto my-auto h-[80vh] md:h-[60vh] flex items-center justify-center relative"
            >
              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover scale-105 blur-md opacity-30 absolute inset-0" />
              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-20" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="absolute inset-0 z-10 flex flex-col justify-end pointer-events-none">
        <div className="p-8 sm:p-12 pb-24 sm:pb-32 space-y-4 max-w-2xl pointer-events-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-orange-600 text-white border-none uppercase text-[10px] tracking-widest px-3 py-1">
                {item.category}
              </Badge>
              {item.glbUrl && (
                <Badge variant="outline" className="text-white border-white/40 bg-white/5 backdrop-blur-md text-[10px] flex gap-1.5 py-1">
                  <Sparkles className="w-3 h-3 text-orange-400" /> 3D EXPERIENCE
                </Badge>
              )}
            </div>
            <h2 className="text-5xl sm:text-8xl font-display font-black tracking-tighter leading-[0.85] mb-4">{item.name}</h2>
            <p className="text-3xl font-black text-orange-500">${item.price.toFixed(2)}</p>
          </motion.div>
          <div className="flex items-center gap-4">
            <Button
              size="lg"
              disabled={isAdding}
              className={`h-16 w-full sm:w-auto px-12 rounded-full font-black text-xl transition-all duration-300 ${
                isAdding ? "bg-green-500 text-white scale-95" : "bg-white text-black hover:bg-zinc-100"
              }`}
              onClick={handleAdd}
            >
              {isAdding ? <><Check className="mr-2 w-6 h-6" /> Added to Order</> : <><ShoppingBag className="mr-2 w-6 h-6" /> Add to Order</>}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-16 w-16 rounded-full border-white/20 bg-black/40 backdrop-blur-xl"
              onClick={() => setShowDetails(true)}
            >
              <Info className="w-7 h-7" />
            </Button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/80 backdrop-blur-2xl flex items-center justify-center p-6"
          >
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="max-w-md w-full space-y-10">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-600/20 rounded-2xl"><ChefHat className="w-8 h-8 text-orange-500" /></div>
                  <h3 className="text-4xl font-black tracking-tighter">Chef's Notes</h3>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowDetails(false)} className="rounded-full bg-white/10 h-12 w-12"><X className="w-6 h-6" /></Button>
              </div>
              <p className="text-2xl text-zinc-300 leading-tight font-bold">{item.description}</p>
              <Button variant="outline" className="w-full h-16 rounded-3xl border-white/10 bg-white/5 font-black" onClick={() => setShowDetails(false)}>Back to View</Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
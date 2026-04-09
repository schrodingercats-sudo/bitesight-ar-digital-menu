import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, X, Sparkles, ChefHat } from 'lucide-react';
import type { MenuItem } from '@shared/types';
import { ARModelViewer } from './ARModelViewer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
interface ImmersiveCardProps {
  item: MenuItem;
}
export function ImmersiveCard({ item }: ImmersiveCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  return (
    <div className="relative h-full w-full bg-black text-white overflow-hidden flex flex-col">
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {item.glbUrl ? (
            <motion.div
              key={`${item.id}-ar`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full max-h-[75dvh] flex items-center justify-center"
            >
              <ARModelViewer
                src={item.glbUrl}
                alt={item.name}
                poster={item.imageUrl}
                className="w-full h-full"
              />
            </motion.div>
          ) : (
            <motion.div
              key={`${item.id}-img`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full flex items-center justify-center relative"
            >
              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover scale-110 blur-2xl opacity-40 absolute inset-0" />
              <img src={item.imageUrl} alt={item.name} className="max-w-[90%] max-h-[70%] object-contain relative z-10 rounded-2xl shadow-2xl" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-20" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="absolute inset-0 z-10 flex flex-col justify-end pointer-events-none">
        <div className="p-8 sm:p-12 pb-[120px] sm:pb-[140px] space-y-4 max-w-2xl pointer-events-auto">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge className="bg-orange-600 text-white border-none uppercase text-[10px] tracking-widest px-3 py-1 font-black">
                {item.category}
              </Badge>
              {item.glbUrl && (
                <Badge variant="outline" className="text-white border-white/40 bg-white/5 backdrop-blur-md text-[10px] flex gap-1.5 py-1 font-black">
                  <Sparkles className="w-3 h-3 text-orange-400" /> 3D EXPERIENCE
                </Badge>
              )}
            </div>
            <h2 className="text-5xl sm:text-7xl font-display font-black tracking-tighter leading-[0.9] mb-2">{item.name}</h2>
            <p className="text-3xl font-black text-orange-500">${item.price.toFixed(2)}</p>
          </motion.div>
          <div className="flex items-center gap-3">
            <Button
              size="lg"
              className="h-14 flex-1 sm:flex-none sm:px-12 rounded-full font-black text-lg transition-all duration-300 bg-white text-black hover:bg-zinc-200 active:scale-95"
              onClick={() => setShowDetails(true)}
            >
              Explore Details
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-14 w-14 rounded-full border-white/20 bg-black/40 backdrop-blur-xl text-white hover:bg-white/10"
              onClick={() => setShowDetails(true)}
            >
              <Info className="w-6 h-6" />
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
            className="absolute inset-0 z-50 bg-black/90 backdrop-blur-3xl flex items-center justify-center p-8"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="max-w-md w-full space-y-8"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4 text-white">
                  <div className="p-3 bg-orange-600/20 rounded-2xl"><ChefHat className="w-8 h-8 text-orange-500" /></div>
                  <h3 className="text-3xl font-black tracking-tighter uppercase">Chef's Notes</h3>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowDetails(false)} className="rounded-full bg-white/10 h-10 w-10 text-white hover:bg-white/20"><X className="w-5 h-5" /></Button>
              </div>
              <p className="text-2xl text-zinc-300 leading-tight font-bold italic">"{item.description}"</p>
              <div className="flex flex-wrap gap-2">
                {item.dietaryTags.map(tag => (
                  <Badge key={tag} variant="secondary" className="bg-white/5 border-white/10 text-white font-black text-[10px] px-3 py-1 uppercase">{tag}</Badge>
                ))}
              </div>
              <Button variant="outline" className="w-full h-14 rounded-full border-white/10 bg-white/5 font-black text-white hover:bg-white/10" onClick={() => setShowDetails(false)}>Resume Experience</Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
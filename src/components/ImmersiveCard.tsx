import React from 'react';
import { motion } from 'framer-motion';
import type { MenuItem } from '@shared/types';
import { ARModelViewer } from './ARModelViewer';
import { Badge } from '@/components/ui/badge';
import { Box } from 'lucide-react';
interface ImmersiveCardProps {
  item: MenuItem;
}
export function ImmersiveCard({ item }: ImmersiveCardProps) {
  return (
    <div className="relative h-full w-full bg-black text-white overflow-hidden flex flex-col">
      {/* Background/3D Layer */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        {item.glbUrl ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-full flex items-center justify-center pt-10"
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-full flex items-center justify-center relative"
          >
            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover scale-110 blur-3xl opacity-30 absolute inset-0" />
            <img src={item.imageUrl} alt={item.name} className="max-w-[85%] max-h-[60%] object-contain relative z-10 rounded-2xl shadow-2xl" />
          </motion.div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />
      </div>
      {/* 3D Indicator Badge */}
      {item.glbUrl && (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute top-28 right-6 z-20"
        >
          <div className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full bg-orange-600/20 backdrop-blur-xl border border-orange-500/30 flex items-center justify-center animate-pulse">
              <Box className="w-6 h-6 text-orange-500" />
            </div>
            <span className="text-[8px] font-black uppercase tracking-widest text-orange-500/80">Active 3D</span>
          </div>
        </motion.div>
      )}
      {/* Info Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end pointer-events-none">
        <div className="p-8 sm:p-12 pb-32 space-y-4 max-w-2xl pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge className="bg-orange-600 text-white border-none uppercase text-[9px] tracking-[0.2em] px-3 py-1 font-black rounded-full">
                {item.category}
              </Badge>
            </div>
            <h2 className="text-5xl sm:text-7xl font-display font-black tracking-tighter leading-[0.85] mb-2 drop-shadow-2xl">
              {item.name.toUpperCase()}
            </h2>
            <div className="flex items-center gap-4">
              <p className="text-3xl font-black text-orange-500">${item.price.toFixed(2)}</p>
              <div className="h-px flex-1 bg-white/10" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { motion } from 'framer-motion';
import type { MenuItem } from '@shared/types';
import { ARModelViewer } from './ARModelViewer';
import { Badge } from '@/components/ui/badge';

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
            className="w-full h-full max-h-[85dvh] flex items-center justify-center pt-20"
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
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-20" />
          </motion.div>
        )}
      </div>

      {/* Info/Branding Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end pointer-events-none">
        <div className="p-8 sm:p-12 pb-32 space-y-4 max-w-2xl pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge className="bg-orange-600 text-white border-none uppercase text-[9px] tracking-widest px-2.5 py-0.5 font-black">
                {item.category}
              </Badge>
            </div>
            <h2 className="text-4xl sm:text-6xl font-display font-black tracking-tighter leading-[0.9] mb-1">{item.name}</h2>
            <p className="text-2xl font-black text-orange-500">${item.price.toFixed(2)}</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
//
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { useOrderStore } from '@/store/useOrderStore';
import { ReceiptText, Clock, CheckCircle2, Loader2, UtensilsCrossed, ArrowRight, Timer } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api-client';
import type { Order } from '@shared/types';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
interface OrderHistorySheetProps {
  isOpen: boolean;
  onClose: () => void;
}
export function OrderHistorySheet({ isOpen, onClose }: OrderHistorySheetProps) {
  const placedOrderIds = useOrderStore(useShallow((s) => s.placedOrderIds));
  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ['my-orders'],
    queryFn: () => api<Order[]>('/api/orders'),
    enabled: isOpen,
    refetchInterval: 10000,
  });
  const myOrders = orders
    .filter(o => placedOrderIds.includes(o.id))
    .sort((a, b) => b.timestamp - a.timestamp);
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0 border-none bg-zinc-950 text-white">
        <SheetHeader className="p-8 border-b border-white/5">
          <SheetTitle className="flex items-center gap-3 text-3xl font-black tracking-tighter">
            <ReceiptText className="w-7 h-7 text-orange-500" />
            Activity
          </SheetTitle>
          <SheetDescription className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.3em]">
            Track your dishes
          </SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-orange-500/40" />
            <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">Checking kitchen status</p>
          </div>
        ) : myOrders.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-10">
            <div className="w-32 h-32 bg-zinc-900 rounded-[3rem] flex items-center justify-center border-2 border-dashed border-zinc-800 rotate-12">
              <UtensilsCrossed className="w-14 h-14 text-zinc-700 -rotate-12" />
            </div>
            <div className="space-y-3">
              <h4 className="text-3xl font-black tracking-tighter">No orders yet</h4>
              <p className="text-zinc-500 font-medium leading-relaxed max-w-[240px] mx-auto">
                Once you confirm your order, you can track the magic here.
              </p>
            </div>
            <Button className="h-16 w-full rounded-2xl bg-orange-600 hover:bg-orange-700 font-black text-lg" onClick={onClose}>
              Back to Menu <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        ) : (
          <ScrollArea className="flex-1 p-8">
            <div className="space-y-8 pb-20">
              {myOrders.map((order) => (
                <div key={order.id} className="bg-zinc-900/50 rounded-[2.5rem] p-6 border border-white/5 relative overflow-hidden group">
                  <div className="flex justify-between items-start mb-6">
                    <div className="space-y-2">
                      <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-zinc-500">Order #{order.id.slice(0, 8)}</h4>
                      <div className="flex items-center gap-2 text-xs font-bold text-zinc-400">
                        <Clock className="w-4 h-4 text-orange-500" />
                        {formatDistanceToNow(order.timestamp)} ago
                      </div>
                    </div>
                    <Badge
                      className={cn(
                        "rounded-xl border-none font-black px-4 py-2 text-[10px] uppercase tracking-widest",
                        order.status === 'pending'
                          ? "bg-orange-500/10 text-orange-500"
                          : "bg-green-500/10 text-green-500"
                      )}
                    >
                      {order.status === 'pending' && (
                        <motion.span 
                          animate={{ opacity: [1, 0.4, 1] }} 
                          transition={{ repeat: Infinity, duration: 1.5 }} 
                          className="mr-2 inline-block w-1.5 h-1.5 rounded-full bg-orange-500" 
                        />
                      )}
                      {order.status === 'pending' ? 'Preparing' : 'Served'}
                    </Badge>
                  </div>
                  <div className="space-y-4 mb-8">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center group-hover:translate-x-1 transition-transform">
                        <div className="flex items-center gap-3">
                           <span className="text-orange-500 font-black text-sm">{item.quantity}x</span>
                           <span className="text-zinc-300 font-bold text-sm">{item.name}</span>
                        </div>
                        <span className="font-black text-sm text-zinc-400">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-5 border-t border-white/5 flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Total Paid</span>
                    <span className="text-2xl font-black text-orange-500 tracking-tighter">${order.total.toFixed(2)}</span>
                  </div>
                  {order.status === 'completed' && (
                    <div className="absolute -right-4 -bottom-4 opacity-[0.03] rotate-12 pointer-events-none">
                      <CheckCircle2 className="w-40 h-40 text-green-500" />
                    </div>
                  )}
                  {order.status === 'pending' && (
                    <div className="absolute -right-4 -bottom-4 opacity-[0.03] -rotate-12 pointer-events-none">
                      <Timer className="w-40 h-40 text-orange-500" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </SheetContent>
    </Sheet>
  );
}
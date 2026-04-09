import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useCartStore } from '@/store/useCartStore';
import { ReceiptText, Clock, CheckCircle2, Loader2, UtensilsCrossed, ArrowRight } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api-client';
import type { Order } from '@shared/types';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
interface OrderHistorySheetProps {
  isOpen: boolean;
  onClose: () => void;
}
export function OrderHistorySheet({ isOpen, onClose }: OrderHistorySheetProps) {
  const placedOrderIds = useCartStore((s) => s.placedOrderIds);
  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ['my-orders'],
    queryFn: () => api<Order[]>('/api/orders'),
    enabled: isOpen,
    refetchInterval: 15000,
  });
  const myOrders = orders
    .filter(o => placedOrderIds.includes(o.id))
    .sort((a, b) => b.timestamp - a.timestamp);
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="p-6 border-b border-border/50">
          <SheetTitle className="flex items-center gap-2 text-2xl font-black tracking-tight">
            <ReceiptText className="w-6 h-6 text-orange-500" />
            Your Activity
          </SheetTitle>
        </SheetHeader>
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-orange-500/50" />
          </div>
        ) : myOrders.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-10 text-center space-y-6">
            <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center border border-dashed border-border/50">
              <UtensilsCrossed className="w-10 h-10 text-muted-foreground opacity-40" />
            </div>
            <div className="space-y-2">
              <p className="text-xl font-bold">No orders found.</p>
              <p className="text-muted-foreground text-sm">Your order history will appear here once you place your first order.</p>
            </div>
            <Button className="w-full h-12 rounded-xl bg-orange-600 hover:bg-orange-700 font-bold" onClick={onClose}>
              Browse Menu <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        ) : (
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6 pb-12">
              {myOrders.map((order) => (
                <div key={order.id} className="bg-muted/30 rounded-2xl p-5 border border-border/50 relative overflow-hidden group hover:bg-muted/40 transition-colors">
                  <div className="flex justify-between items-start mb-5">
                    <div className="space-y-1">
                      <h4 className="font-black text-sm uppercase tracking-wider text-muted-foreground/80">Order #{order.id.slice(0, 8)}</h4>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDistanceToNow(order.timestamp)} ago
                      </div>
                    </div>
                    <Badge
                      className={cn(
                        "rounded-md border-none font-bold px-2 py-1",
                        order.status === 'pending'
                          ? "bg-orange-100 text-orange-700 hover:bg-orange-100"
                          : "bg-green-100 text-green-700 hover:bg-green-100"
                      )}
                    >
                      {order.status === 'pending' ? 'Preparing' : 'Served'}
                    </Badge>
                  </div>
                  <div className="space-y-3 mb-5">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm group-hover:translate-x-1 transition-transform">
                        <span className="text-muted-foreground font-medium flex gap-2">
                          <span className="text-orange-600 font-bold">{item.quantity}x</span> 
                          {item.name}
                        </span>
                        <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-border/50 flex justify-between items-center">
                    <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Amount Paid</span>
                    <span className="text-lg font-black text-orange-600">${order.total.toFixed(2)}</span>
                  </div>
                  {order.status === 'completed' && (
                    <div className="absolute -right-2 -bottom-2 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                      <CheckCircle2 className="w-20 h-20 text-green-600" />
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
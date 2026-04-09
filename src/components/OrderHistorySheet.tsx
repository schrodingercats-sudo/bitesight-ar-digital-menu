import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useCartStore } from '@/store/useCartStore';
import { ReceiptText, Clock, CheckCircle2, Loader2, UtensilsCrossed } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api-client';
import type { Order } from '@shared/types';
import { formatDistanceToNow } from 'date-fns';
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
  const myOrders = orders.filter(o => placedOrderIds.includes(o.id));
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="p-6 border-b">
          <SheetTitle className="flex items-center gap-2">
            <ReceiptText className="w-5 h-5 text-primary" />
            Order History
          </SheetTitle>
        </SheetHeader>
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : myOrders.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <UtensilsCrossed className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">You haven't placed any orders yet.</p>
          </div>
        ) : (
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6">
              {myOrders.map((order) => (
                <div key={order.id} className="bg-muted/30 rounded-2xl p-4 border relative overflow-hidden">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-sm">Order #{order.id.slice(0, 8)}</h4>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(order.timestamp)} ago
                      </div>
                    </div>
                    <Badge 
                      className={order.status === 'pending' 
                        ? "bg-orange-100 text-orange-700 hover:bg-orange-100 border-none" 
                        : "bg-green-100 text-green-700 hover:bg-green-100 border-none"
                      }
                    >
                      {order.status === 'pending' ? 'Preparing' : 'Completed'}
                    </Badge>
                  </div>
                  <div className="space-y-2 mb-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-xs">
                        <span className="text-muted-foreground">
                          {item.quantity}x {item.name}
                        </span>
                        <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-3 border-t flex justify-between items-center">
                    <span className="text-sm font-bold">Total</span>
                    <span className="text-sm font-bold text-primary">${order.total.toFixed(2)}</span>
                  </div>
                  {order.status === 'completed' && (
                    <div className="absolute -right-1 -bottom-1 opacity-10">
                      <CheckCircle2 className="w-16 h-16 text-green-600" />
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
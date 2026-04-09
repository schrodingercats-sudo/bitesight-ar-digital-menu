import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Clock,
  ChefHat,
  RefreshCcw,
  ChevronRight,
  History,
  AlertCircle
} from 'lucide-react';
import { api } from '@/lib/api-client';
import type { Order } from '@shared/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ThemeToggle } from '@/components/ThemeToggle';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
export function KitchenPage() {
  const [showHistory, setShowHistory] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const queryClient = useQueryClient();
  const { data: orders = [], isLoading, isFetching } = useQuery<Order[]>({
    queryKey: ['kitchen-orders'],
    queryFn: async () => {
      const data = await api<Order[]>('/api/orders');
      setLastUpdated(new Date());
      return data;
    },
    refetchInterval: 10000,
  });
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'completed' | 'cancelled' | 'pending' }) =>
      api<Order>(`/api/orders/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kitchen-orders'] });
      toast.success('Order status updated');
    },
  });
  const activeOrders = orders.filter(o => o.status === 'pending').sort((a, b) => a.timestamp - b.timestamp);
  const completedOrders = orders.filter(o => o.status === 'completed').sort((a, b) => b.timestamp - a.timestamp);
  const displayedOrders = showHistory ? completedOrders : activeOrders;
  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="py-8 md:py-10 lg:py-12">
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 border-b border-border/50 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="bg-[#EA580C]/10 p-2 rounded-xl">
                <ChefHat className="w-8 h-8 text-[#EA580C]" />
              </div>
              <h1 className="text-4xl font-display font-black tracking-tighter">Kitchen Dashboard</h1>
            </div>
            <div className="flex items-center gap-4 text-muted-foreground font-medium">
              <p className="flex items-center gap-2">
                <Badge variant="secondary" className="rounded-md font-bold text-orange-600 bg-orange-50">
                  {activeOrders.length}
                </Badge>
                Active Orders
              </p>
              <div className="h-4 w-[1px] bg-border" />
              <p className="flex items-center gap-1 text-xs">
                <RefreshCcw className={isFetching ? "w-3 h-3 animate-spin text-orange-500" : "w-3 h-3"} />
                Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle className="hover:bg-muted" />
            <Button
              variant={showHistory ? "default" : "outline"}
              onClick={() => setShowHistory(!showHistory)}
              className="gap-2 h-11 px-6 rounded-xl font-bold transition-all shadow-sm"
            >
              {showHistory ? <ChefHat className="w-4 h-4" /> : <History className="w-4 h-4" />}
              {showHistory ? "View Active Queue" : "Order History"}
            </Button>
          </div>
        </header>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} className="h-80 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {displayedOrders.map((order) => (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                >
                  <Card className="border-none shadow-soft overflow-hidden h-full flex flex-col hover:ring-2 hover:ring-primary/20 transition-all group">
                    <CardHeader className="bg-muted/40 pb-4 border-b border-border/30">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <CardTitle className="text-2xl font-black tracking-tight">{order.tableNumber}</CardTitle>
                          <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest opacity-60">ID: {order.id.slice(0, 8)}</p>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn(
                            "rounded-md border-2 font-bold px-2 py-0.5",
                            order.status === 'pending'
                              ? "bg-orange-50 text-orange-700 border-orange-200"
                              : "bg-green-50 text-green-700 border-green-200"
                          )}
                        >
                          {order.status.toUpperCase()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6 flex-1">
                      <div className="space-y-4">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-start gap-3">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#EA580C] text-white font-black shadow-sm group-hover:scale-110 transition-transform">
                                {item.quantity}
                              </span>
                              <div className="space-y-0.5">
                                <p className="font-bold text-sm leading-tight">{item.name}</p>
                                <p className="text-[10px] text-muted-foreground font-medium uppercase">{item.category}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="border-t border-border/30 bg-muted/10 flex justify-between items-center py-4 px-6">
                      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                        <Clock className="w-4 h-4 text-orange-500" />
                        {formatDistanceToNow(order.timestamp)} ago
                      </div>
                      {order.status === 'pending' && (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 font-bold px-4 rounded-lg shadow-lg shadow-green-600/20 active:scale-95 transition-all"
                          onClick={() => updateStatusMutation.mutate({ id: order.id, status: 'completed' })}
                          disabled={updateStatusMutation.isPending}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Complete
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
        {!isLoading && displayedOrders.length === 0 && (
          <div className="text-center py-32 bg-muted/10 rounded-[3rem] border-2 border-dashed border-border/50">
            <div className="bg-muted w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              {showHistory ? <AlertCircle className="w-10 h-10 text-muted-foreground" /> : <ChefHat className="w-10 h-10 text-[#EA580C] opacity-40" />}
            </div>
            <h3 className="text-xl font-bold mb-2">
              {showHistory ? "No order history found." : "The queue is clean!"}
            </h3>
            <p className="text-muted-foreground font-medium">
              {showHistory ? "Check back after more orders are completed." : "Take a moment to prepare for the next rush."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  Clock, 
  ChefHat, 
  RefreshCcw, 
  ChevronRight, 
  History 
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
export function KitchenPage() {
  const [showHistory, setShowHistory] = useState(false);
  const queryClient = useQueryClient();
  const { data: orders = [], isLoading, isFetching } = useQuery<Order[]>({
    queryKey: ['kitchen-orders'],
    queryFn: () => api<Order[]>('/api/orders'),
    refetchInterval: 10000, // Poll every 10s
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
  const activeOrders = orders.filter(o => o.status === 'pending');
  const completedOrders = orders.filter(o => o.status === 'completed');
  const displayedOrders = showHistory ? completedOrders : activeOrders;
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ChefHat className="w-6 h-6 text-[#EA580C]" />
              <h1 className="text-3xl font-display font-bold">Kitchen Dashboard</h1>
            </div>
            <p className="text-muted-foreground">
              {activeOrders.length} active orders currently in queue
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle className="relative top-0 right-0" />
            <Button
              variant={showHistory ? "default" : "outline"}
              onClick={() => setShowHistory(!showHistory)}
              className="gap-2"
            >
              {showHistory ? <ChevronRight className="w-4 h-4" /> : <History className="w-4 h-4" />}
              {showHistory ? "Back to Queue" : "Order History"}
            </Button>
            <div className="w-10 h-10 flex items-center justify-center">
              {isFetching && <RefreshCcw className="w-4 h-4 animate-spin text-muted-foreground" />}
            </div>
          </div>
        </header>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {displayedOrders.map((order) => (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Card className="border-none shadow-soft overflow-hidden">
                    <CardHeader className="bg-muted/30 pb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl font-bold">{order.tableNumber}</CardTitle>
                          <p className="text-xs text-muted-foreground font-mono mt-1">#{order.id.slice(0, 8)}</p>
                        </div>
                        <Badge variant={order.status === 'pending' ? 'outline' : 'default'} className={order.status === 'pending' ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-green-50 text-green-700 border-green-200'}>
                          {order.status.toUpperCase()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <span className="flex items-center justify-center w-6 h-6 rounded bg-primary/10 text-primary text-xs font-bold">
                                {item.quantity}
                              </span>
                              <span className="font-medium text-sm">{item.name}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="border-t bg-muted/10 flex justify-between items-center py-3">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDistanceToNow(order.timestamp)} ago
                      </div>
                      {order.status === 'pending' && (
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => updateStatusMutation.mutate({ id: order.id, status: 'completed' })}
                          disabled={updateStatusMutation.isPending}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Done
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
          <div className="text-center py-24 bg-muted/20 rounded-3xl border-2 border-dashed">
            <ChefHat className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground font-medium">
              {showHistory ? "No completed orders found." : "Queue is empty. Take a break!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
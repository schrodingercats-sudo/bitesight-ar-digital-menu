import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/useCartStore';
import { Minus, Plus, Trash2, ShoppingBasket, Loader2, Sparkles } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/api-client';
import type { OrderRequest, Order } from '@shared/types';
import { motion, AnimatePresence } from 'framer-motion';
interface CartSheetProps {
  isOpen: boolean;
  onClose: () => void;
  tableNumber: string;
}
export function CartSheet({ isOpen, onClose, tableNumber }: CartSheetProps) {
  const items = useCartStore(useShallow((s) => s.items));
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const getTotal = useCartStore((s) => s.getTotal);
  const clearCart = useCartStore((s) => s.clearCart);
  const addPlacedOrder = useCartStore((s) => s.addPlacedOrder);
  const subtotal = getTotal();
  const tax = subtotal * 0.08;
  const total = subtotal + tax;
  const checkoutMutation = useMutation({
    mutationFn: (order: OrderRequest) => api<Order>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    }),
    onSuccess: (data) => {
      toast.success('Order Received!', {
        description: `Chef is notified for ${tableNumber}.`,
      });
      if (data?.id) addPlacedOrder(data.id);
      clearCart();
      onClose();
    },
    onError: (error: Error) => {
      toast.error('Kitchen Error', {
        description: error.message,
      });
    },
  });
  const handleCheckout = () => {
    checkoutMutation.mutate({ items, tableNumber });
  };
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="bottom" className="h-[85dvh] sm:h-full sm:max-w-md ml-auto flex flex-col p-0 border-none bg-zinc-950 text-white rounded-t-[3rem] sm:rounded-none overflow-hidden">
        <SheetHeader className="p-8 pb-4">
          <SheetTitle className="flex items-center gap-3 text-3xl font-black tracking-tighter">
            <div className="bg-orange-600 p-2 rounded-2xl shadow-lg shadow-orange-600/20">
              <ShoppingBasket className="w-6 h-6 text-white" />
            </div>
            Checkout
          </SheetTitle>
          <p className="text-zinc-500 font-bold uppercase text-xs tracking-widest">{tableNumber} • Review your feast</p>
        </SheetHeader>
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-8">
            <div className="w-32 h-32 bg-zinc-900 rounded-full flex items-center justify-center border-2 border-dashed border-zinc-800">
              <ShoppingBasket className="w-12 h-12 text-zinc-700" />
            </div>
            <div className="space-y-2">
              <h4 className="text-2xl font-black">Your bag is empty</h4>
              <p className="text-zinc-500 font-medium leading-relaxed">Delicious things are waiting for you in the menu.</p>
            </div>
            <Button variant="outline" className="h-14 w-full rounded-2xl border-zinc-800 text-zinc-300 font-bold" onClick={onClose}>
              Start Exploring
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-8">
              <div className="space-y-8 py-6">
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.div 
                      key={item.id} 
                      layout 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex gap-5"
                    >
                      <div className="relative group">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-24 h-24 rounded-3xl object-cover flex-shrink-0 shadow-2xl"
                        />
                        {item.glbUrl && <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-orange-400 bg-black rounded-full p-1" />}
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-black text-lg leading-tight truncate pr-4">{item.name}</h4>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-zinc-600 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-orange-500">${item.price.toFixed(2)}</span>
                          <div className="flex items-center gap-4 bg-zinc-900 rounded-2xl p-1 px-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-xl hover:bg-zinc-800 text-white"
                              onClick={() => updateQuantity(item.id, -1)}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="text-sm font-black w-4 text-center">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-xl hover:bg-zinc-800 text-white"
                              onClick={() => updateQuantity(item.id, 1)}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </ScrollArea>
            <div className="p-8 pt-6 bg-zinc-900/40 space-y-6 border-t border-white/5 rounded-t-[3rem]">
              <div className="space-y-3 font-bold">
                <div className="flex justify-between text-zinc-500 uppercase text-xs tracking-widest">
                  <span>Subtotal</span>
                  <span className="text-zinc-300">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-zinc-500 uppercase text-xs tracking-widest">
                  <span>Service Tax</span>
                  <span className="text-zinc-300">${tax.toFixed(2)}</span>
                </div>
                <Separator className="bg-white/5 my-2" />
                <div className="flex justify-between items-end">
                  <span className="text-lg font-black tracking-tighter uppercase">Total Amount</span>
                  <span className="text-4xl font-black text-orange-500 tracking-tighter">${total.toFixed(2)}</span>
                </div>
              </div>
              <Button
                className="w-full h-20 text-xl font-black rounded-3xl bg-orange-600 hover:bg-orange-700 shadow-2xl shadow-orange-600/20 active:scale-[0.98] transition-all"
                disabled={checkoutMutation.isPending}
                onClick={handleCheckout}
              >
                {checkoutMutation.isPending ? (
                  <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                ) : <Sparkles className="mr-3 h-6 w-6" />}
                Confirm & Pay
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
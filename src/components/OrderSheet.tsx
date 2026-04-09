import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ShoppingBag, Minus, Plus, Trash2, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { useOrderStore } from '@/store/useOrderStore';
import { api } from '@/lib/api-client';
import type { Order } from '@shared/types';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
interface OrderSheetProps {
  isOpen: boolean;
  onClose: () => void;
  tableNumber: string;
}
export function OrderSheet({ isOpen, onClose, tableNumber }: OrderSheetProps) {
  const items = useOrderStore((s) => s.items);
  const updateQuantity = useOrderStore((s) => s.updateQuantity);
  const removeFromOrder = useOrderStore((s) => s.removeFromOrder);
  const clearOrder = useOrderStore((s) => s.clearOrder);
  const addPlacedOrderId = useOrderStore((s) => s.addPlacedOrderId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const handlePlaceOrder = async () => {
    if (items.length === 0) return;
    setIsSubmitting(true);
    try {
      const order = await api<Order>('/api/orders', {
        method: 'POST',
        body: JSON.stringify({ items, tableNumber }),
      });
      addPlacedOrderId(order.id);
      setOrderComplete(true);
      setTimeout(() => {
        clearOrder();
        onClose();
        setOrderComplete(false);
      }, 2000);
      toast.success('Order placed successfully!');
    } catch (err) {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0 border-none bg-zinc-950 text-white">
        <SheetHeader className="p-8 border-b border-white/5">
          <SheetTitle className="flex items-center gap-3 text-3xl font-black tracking-tighter">
            <ShoppingBag className="w-7 h-7 text-orange-500" />
            Your Order
          </SheetTitle>
          <SheetDescription className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.3em]">
            Review your dishes
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 flex flex-col overflow-hidden">
          <AnimatePresence mode="wait">
            {orderComplete ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 flex flex-col items-center justify-center p-12 text-center"
              >
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(34,197,94,0.3)]">
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-3xl font-black mb-2 tracking-tighter">Order Received!</h3>
                <p className="text-zinc-400 font-medium">The kitchen is already preparing your feast.</p>
              </motion.div>
            ) : items.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col items-center justify-center p-12 text-center"
              >
                <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6 opacity-20">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold mb-2">Order is empty</h3>
                <p className="text-zinc-500 text-sm mb-8">Go ahead and add some delicious items from the menu.</p>
                <Button variant="outline" className="rounded-full border-white/10 hover:bg-white/5" onClick={onClose}>
                  Back to Menu
                </Button>
              </motion.div>
            ) : (
              <ScrollArea className="flex-1 px-8 py-6">
                <div className="space-y-6">
                  {items.map((item) => (
                    <motion.div
                      layout
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-4 group"
                    >
                      <div className="h-16 w-16 rounded-2xl overflow-hidden flex-shrink-0 border border-white/5">
                        <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm truncate text-zinc-100">{item.name}</h4>
                        <p className="text-orange-500 font-black text-xs mt-1">${item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-3 bg-zinc-900 p-1 rounded-xl border border-white/5">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg hover:bg-zinc-800"
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          {item.quantity === 1 ? <Trash2 className="w-3.5 h-3.5 text-zinc-500" /> : <Minus className="w-3.5 h-3.5" />}
                        </Button>
                        <span className="font-black text-sm w-4 text-center">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg hover:bg-zinc-800"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          <Plus className="w-3.5 h-3.5 text-orange-500" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </AnimatePresence>
        </div>
        {items.length > 0 && !orderComplete && (
          <div className="p-8 border-t border-white/5 bg-zinc-900/30">
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Table Identifier</span>
                <span className="font-black text-zinc-100">{tableNumber}</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Total Amount</span>
                <span className="text-4xl font-black text-orange-500 tracking-tighter">${total.toFixed(2)}</span>
              </div>
            </div>
            <Button
              className="w-full h-20 rounded-[2rem] bg-orange-600 hover:bg-orange-700 text-xl font-black shadow-[0_15px_40px_rgba(234,88,12,0.3)] transition-all active:scale-95 group"
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  PLACE ORDER <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
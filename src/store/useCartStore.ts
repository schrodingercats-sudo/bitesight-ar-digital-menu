import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MenuItem, CartItem } from '@shared/types';
interface CartState {
  items: CartItem[];
  placedOrderIds: string[];
  addItem: (item: MenuItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  addPlacedOrder: (orderId: string) => void;
  getTotal: () => number;
}
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      placedOrderIds: [],
      addItem: (item) => set((state) => {
        const existing = state.items.find((i) => i.id === item.id);
        if (existing) {
          return {
            items: state.items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          };
        }
        return { items: [...state.items, { ...item, quantity: 1 }] };
      }),
      removeItem: (id) => set((state) => ({
        items: state.items.filter((i) => i.id !== id),
      })),
      updateQuantity: (id, delta) => set((state) => ({
        items: state.items
          .map((i) => (i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i))
          .filter((i) => i.quantity > 0),
      })),
      clearCart: () => set({ items: [] }),
      addPlacedOrder: (orderId) => set((state) => ({
        placedOrderIds: [...state.placedOrderIds, orderId]
      })),
      getTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    { name: 'bitesight-cart-v2' }
  )
);
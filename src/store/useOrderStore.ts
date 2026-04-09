import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, MenuItem } from '@shared/types';
interface OrderState {
  items: CartItem[];
  placedOrderIds: string[];
  addToOrder: (item: MenuItem) => void;
  removeFromOrder: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearOrder: () => void;
  addPlacedOrderId: (id: string) => void;
}
export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      items: [],
      placedOrderIds: [],
      addToOrder: (item) =>
        set((state) => {
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
      removeFromOrder: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),
      updateQuantity: (id, delta) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i
            )
            .filter((i) => i.quantity > 0),
        })),
      clearOrder: () => set({ items: [] }),
      addPlacedOrderId: (id) =>
        set((state) => ({
          placedOrderIds: [...state.placedOrderIds, id],
        })),
    }),
    {
      name: 'bitesight-order-v1',
    }
  )
);
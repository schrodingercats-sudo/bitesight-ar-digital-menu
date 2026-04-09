export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export interface User {
  id: string;
  name: string;
}
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  glbUrl?: string;
  dietaryTags: string[];
}
export interface CartItem extends MenuItem {
  quantity: number;
}
export type OrderStatus = 'pending' | 'completed' | 'cancelled';
export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  tableNumber: string;
  timestamp: number;
}
export interface OrderRequest {
  items: CartItem[];
  tableNumber: string;
}
export interface Chat {
  id: string;
  title: string;
}
export interface ChatMessage {
  id: string;
  chatId: string;
  userId: string;
  text: string;
  ts: number;
}
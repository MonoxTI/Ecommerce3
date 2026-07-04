import { create } from 'zustand';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
  subtotal: number;
}

interface CartStore {
  items: CartItem[];
  total: number;
  itemCount: number;
  setCart: (cart: { items: CartItem[]; total: number; itemCount: number }) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  total: 0,
  itemCount: 0,
  setCart: (cart) => set(cart),
  clearCart: () => set({ items: [], total: 0, itemCount: 0 }),
}));
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, Order, Address } from '@/types';

interface AppState {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;

  orders: Order[];
  orderCounter: number;
  placeOrder: (address: Address) => string;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      cart: [],
      addToCart: (product) => {
        const cart = get().cart;
        const existing = cart.find((i) => i.product.id === product.id);
        if (existing) {
          set({ cart: cart.map((i) => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i) });
        } else {
          set({ cart: [...cart, { product, quantity: 1 }] });
        }
      },
      removeFromCart: (productId) => set({ cart: get().cart.filter((i) => i.product.id !== productId) }),
      updateQuantity: (productId, qty) => {
        if (qty <= 0) {
          set({ cart: get().cart.filter((i) => i.product.id !== productId) });
        } else {
          set({ cart: get().cart.map((i) => i.product.id === productId ? { ...i, quantity: qty } : i) });
        }
      },
      clearCart: () => set({ cart: [] }),
      getCartTotal: () => get().cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
      getCartCount: () => get().cart.reduce((sum, i) => sum + i.quantity, 0),

      orders: [],
      orderCounter: 10001,
      placeOrder: (address) => {
        const cart = get().cart;
        const subtotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);
        const delivery = subtotal >= 199 ? 0 : 30;
        const orderId = `KN-${get().orderCounter}`;
        const order: Order = {
          id: orderId,
          items: [...cart],
          address,
          subtotal,
          delivery,
          total: subtotal + delivery,
          status: 'placed',
          paymentMethod: 'cod',
          createdAt: new Date().toISOString(),
        };
        set({
          orders: [order, ...get().orders],
          orderCounter: get().orderCounter + 1,
          cart: [],
        });
        return orderId;
      },
    }),
    { name: 'kiraney-store' }
  )
);

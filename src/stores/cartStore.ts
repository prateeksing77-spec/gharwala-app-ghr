import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, Order, Address, Notification } from '@/types';
import { deliverySettings } from '@/data/settings';

interface AppState {
  isLoggedIn: boolean;
  phone: string;
  userName: string;
  selectedArea: string;
  setLoggedIn: (phone: string) => void;
  logout: () => void;
  setArea: (area: string) => void;
  setUserName: (name: string) => void;

  cart: CartItem[];
  addToCart: (product: Product, weight?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;

  orders: Order[];
  orderCounter: number;
  placeOrder: (address: Address, paymentMethod: 'cod' | 'upi', couponCode?: string, discount?: number) => string;

  addresses: Address[];
  addAddress: (address: Omit<Address, 'id'>) => void;

  notifications: Notification[];
  markAllRead: () => void;
  unreadCount: () => number;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      phone: '',
      userName: 'User',
      selectedArea: 'Jalalpur',
      setLoggedIn: (phone) => set({ isLoggedIn: true, phone }),
      logout: () => set({ isLoggedIn: false, phone: '', cart: [] }),
      setArea: (area) => set({ selectedArea: area }),
      setUserName: (name) => set({ userName: name }),

      cart: [],
      addToCart: (product, weight) => {
        const cart = get().cart;
        const existing = cart.find((i) => i.product.id === product.id);
        if (existing) {
          set({ cart: cart.map((i) => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i) });
        } else {
          set({ cart: [...cart, { product, quantity: 1, selectedWeight: weight || product.weight }] });
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
      placeOrder: (address, paymentMethod, couponCode, discount = 0) => {
        const cart = get().cart;
        const subtotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);
        const delivery = subtotal >= deliverySettings.freeDeliveryAbove ? 0 : deliverySettings.deliveryCharge;
        const orderId = `KN-${get().orderCounter}`;
        const order: Order = {
          id: orderId,
          items: [...cart],
          address,
          subtotal,
          delivery,
          discount,
          total: subtotal + delivery - discount,
          status: 'placed',
          paymentMethod,
          createdAt: new Date().toISOString(),
          couponCode,
        };
        set({
          orders: [order, ...get().orders],
          orderCounter: get().orderCounter + 1,
          cart: [],
          notifications: [
            { id: `n-${Date.now()}`, title: 'Order Placed', message: `Your order ${orderId} has been placed successfully!`, read: false, createdAt: new Date().toISOString() },
            ...get().notifications,
          ],
        });
        return orderId;
      },

      addresses: [],
      addAddress: (address) => {
        const id = `addr-${Date.now()}`;
        const isFirst = get().addresses.length === 0;
        set({ addresses: [...get().addresses, { ...address, id, isDefault: isFirst }] });
      },

      notifications: [
        { id: 'n1', title: 'Welcome to KiraNey!', message: 'Ghar baithe kirana - start shopping now.', read: false, createdAt: new Date().toISOString() },
        { id: 'n2', title: 'Get 10% OFF', message: 'Use code KIRANA10 on orders above Rs.300!', read: false, createdAt: new Date().toISOString() },
        { id: 'n3', title: 'Flat 50 Off', message: 'Use code FIRST50 on your first order above Rs.200!', read: false, createdAt: new Date().toISOString() },
      ],
      markAllRead: () => set({ notifications: get().notifications.map((n) => ({ ...n, read: true })) }),
      unreadCount: () => get().notifications.filter((n) => !n.read).length,
    }),
    { name: 'kiraney-store' }
  )
);

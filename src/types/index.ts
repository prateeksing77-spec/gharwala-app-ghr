export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  unit: string;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  house: string;
  street: string;
  area: string;
  pincode: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  address: Address;
  subtotal: number;
  delivery: number;
  total: number;
  status: 'placed' | 'confirmed' | 'out_for_delivery' | 'delivered';
  paymentMethod: 'cod';
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

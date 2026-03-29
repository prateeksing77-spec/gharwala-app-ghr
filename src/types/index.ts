export interface Product {
  id: string;
  name: string;
  nameHindi?: string;
  category: string;
  subcategory: string;
  price: number;
  mrp: number;
  weight: string;
  weightVariants?: string[];
  image: string;
  description: string;
  isLocal?: boolean;
  isFarmFresh?: boolean;
  inStock: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  section: string;
  subcategories: string[];
  image?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedWeight?: string;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  house: string;
  street: string;
  landmark: string;
  area: string;
  pincode: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  items: CartItem[];
  address: Address;
  subtotal: number;
  delivery: number;
  discount: number;
  total: number;
  status: 'placed' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered';
  paymentMethod: 'cod' | 'upi';
  createdAt: string;
  couponCode?: string;
}

export interface Banner {
  id: string;
  image: string;
  title: string;
  gradient: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface Coupon {
  code: string;
  discount: number;
  type: 'percent' | 'flat';
  minOrder: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin';
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  sizes: string[];
  images: string[];
  stock: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  trackingNumber?: string;
  total: number;
  createdAt: Date;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  size: string;
  price: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
}
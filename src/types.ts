import { Timestamp, FieldValue } from 'firebase/firestore';

export type Category = 'Shawarma' | 'Grills' | 'Sandwiches' | 'Sides' | 'Desserts' | 'Drinks';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  isAvailable: boolean;
  createdAt: Timestamp | number | FieldValue;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export const CATEGORIES_LIST: Category[] = ['Shawarma', 'Grills', 'Sandwiches', 'Sides', 'Desserts', 'Drinks'];

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  type: 'dine-in' | 'takeaway';
  createdAt: Timestamp | number | FieldValue;
}

import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  doc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp,
  getDocs
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { MenuItem, Order } from '../types';

const MENU_COLLECTION = 'menu';
const ORDERS_COLLECTION = 'orders';

export const menuService = {
  subscribe: (callback: (items: MenuItem[]) => void, onError?: (err: any) => void) => {
    const q = query(collection(db, MENU_COLLECTION), orderBy('createdAt', 'desc'));
    return onSnapshot(q, {
      next: (snapshot) => {
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as MenuItem[];
        callback(items);
      },
      error: (err) => {
        console.error('Menu subscription error:', err);
        onError?.(err);
      }
    });
  },

  getAll: async () => {
    const q = query(collection(db, MENU_COLLECTION), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as MenuItem[];
  },

  add: async (item: Omit<MenuItem, 'id' | 'createdAt'>) => {
    return addDoc(collection(db, MENU_COLLECTION), {
      ...item,
      createdAt: serverTimestamp(),
      isAvailable: true
    });
  },

  update: async (id: string, item: Partial<MenuItem>) => {
    const docRef = doc(db, MENU_COLLECTION, id);
    return updateDoc(docRef, item);
  },

  delete: async (id: string) => {
    const docRef = doc(db, MENU_COLLECTION, id);
    return deleteDoc(docRef);
  }
};

export const orderService = {
  subscribe: (callback: (orders: Order[]) => void, onError?: (err: any) => void) => {
    const q = query(collection(db, ORDERS_COLLECTION), orderBy('createdAt', 'desc'));
    return onSnapshot(q, {
      next: (snapshot) => {
        const orders = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Order[];
        callback(orders);
      },
      error: (err) => {
        console.error('Orders subscription error:', err);
        onError?.(err);
      }
    });
  },

  create: async (order: Omit<Order, 'id' | 'createdAt'>) => {
    return addDoc(collection(db, ORDERS_COLLECTION), {
      ...order,
      createdAt: serverTimestamp()
    });
  },

  updateStatus: async (id: string, status: Order['status']) => {
    const docRef = doc(db, ORDERS_COLLECTION, id);
    return updateDoc(docRef, { status });
  }
};

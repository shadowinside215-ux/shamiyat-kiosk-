import React, { useState, useEffect } from 'react';
import { menuService } from './services/dbService';
import { MenuItem, CartItem, Order, Category } from './types';
import WelcomeScreen from './components/WelcomeScreen';
import MenuScreen from './components/MenuScreen';
import SuccessScreen from './components/SuccessScreen';
import AdminDashboard from './components/AdminDashboard';
import { generateOrderNumber } from './lib/utils';
import { orderService } from './services/dbService';
import { motion, AnimatePresence } from 'motion/react';

type View = 'welcome' | 'kiosk' | 'success' | 'admin';

export default function App() {
  const [view, setView] = useState<View>('welcome');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [orderType, setOrderType] = useState<'dine-in' | 'takeaway'>('dine-in');

  useEffect(() => {
    const unsubscribe = menuService.subscribe(setMenuItems);
    return () => unsubscribe();
  }, []);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === id);
      if (existing && existing.quantity > 1) {
        return prev.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i);
      }
      return prev.filter(i => i.id !== id);
    });
  };

  const clearCart = () => setCart([]);

  const submitOrder = async () => {
    if (cart.length === 0) return;

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const orderNumber = generateOrderNumber();
    
    // createdAt handled by orderService.create using serverTimestamp
    const newOrder: Omit<Order, 'id' | 'createdAt'> = {
      orderNumber,
      items: cart,
      total,
      status: 'pending',
      type: orderType,
    };

    try {
      const docRef = await orderService.create(newOrder);
      // For local display until server confirms, we simulate the structure
      setLastOrder({ id: docRef.id, ...newOrder, createdAt: Date.now() } as Order);
      setCart([]);
      setView('success');
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  const startOrder = (type: 'dine-in' | 'takeaway') => {
    setOrderType(type);
    setView('kiosk');
  };

  return (
    <div className="min-h-screen bg-sham-dark text-white select-none overflow-hidden touch-none">
      <AnimatePresence mode="wait">
        {view === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-screen"
          >
            <WelcomeScreen onStart={startOrder} onAdmin={() => setView('admin')} />
          </motion.div>
        )}

        {view === 'kiosk' && (
          <motion.div
            key="kiosk"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="h-screen"
          >
            <MenuScreen 
              menuItems={menuItems}
              cart={cart}
              onAddToCart={addToCart}
              onRemoveFromCart={removeFromCart}
              onCancel={() => {
                setCart([]);
                setView('welcome');
              }}
              onSubmit={submitOrder}
            />
          </motion.div>
        )}

        {view === 'success' && lastOrder && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="h-screen"
          >
            <SuccessScreen 
              order={lastOrder} 
              onDone={() => setView('welcome')} 
            />
          </motion.div>
        )}

        {view === 'admin' && (
          <motion.div
            key="admin"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-screen"
          >
            <AdminDashboard onBack={() => setView('welcome')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

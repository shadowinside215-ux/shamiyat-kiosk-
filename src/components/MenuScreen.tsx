import React, { useState, useMemo } from 'react';
import { MenuItem, CartItem, Category } from '../types';
import { ShoppingCart, Plus, Minus, X, Trash2, ArrowRight, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatPrice } from '../lib/utils';
import { cn } from '../lib/utils';

interface MenuScreenProps {
  menuItems: MenuItem[];
  cart: CartItem[];
  onAddToCart: (item: MenuItem) => void;
  onRemoveFromCart: (id: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
}

const CATEGORIES: Category[] = ['Shawarma', 'Grills', 'Sandwiches', 'Sides', 'Desserts', 'Drinks'];

export default function MenuScreen({ 
  menuItems, 
  cart, 
  onAddToCart, 
  onRemoveFromCart, 
  onCancel, 
  onSubmit 
}: MenuScreenProps) {
  const [activeCategory, setActiveCategory] = useState<Category>('Shawarma');
  const [showCart, setShowCart] = useState(false);

  const filteredItems = useMemo(() => {
    return menuItems.filter(item => item.category === activeCategory && item.isAvailable);
  }, [menuItems, activeCategory]);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="flex flex-col h-full bg-sham-dark text-white overflow-hidden">
      {/* Header - Elegant Dark Style */}
      <header className="h-20 bg-linear-to-b from-[#111] to-[#0a0a0b] border-b border-sham-border flex items-center justify-between px-10 flex-shrink-0">
        <div className="text-3xl font-serif text-gold-500 tracking-[2px] uppercase flex items-center gap-4">
          SHAMIYAT <span className="text-gold-500/60 font-serif italic text-xl">شاميات</span>
        </div>
        <div className="flex items-center gap-5">
          <button className="px-3 py-1 border border-gold-500 text-gold-500 rounded text-xs font-bold hover:bg-gold-500/10 transition-colors">FR</button>
          <button className="px-3 py-1 border border-gold-500 text-gold-500 rounded text-xs font-bold hover:bg-gold-500/10 transition-colors">AR</button>
          <div className="text-sm text-text-secondary border-l border-white/20 pl-5">
            Table #08
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation - Elegant Dark Style */}
        <nav className="w-[200px] bg-[#0c0c0e] border-r border-sham-border flex flex-col pt-5">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-8 py-5 text-sm font-medium transition-all text-left uppercase tracking-widest border-l-3",
                activeCategory === cat 
                  ? "text-gold-500 border-l-gold-500 bg-gold-500/5 font-bold"
                  : "text-text-secondary border-l-transparent hover:text-gold-500/80"
              )}
            >
              {cat}
            </button>
          ))}
          
          <div className="mt-auto p-8">
             <button 
              onClick={onCancel}
              className="w-full py-3 text-xs uppercase tracking-widest font-bold border border-red-500/30 text-red-500 rounded-lg hover:bg-red-500/10 transition-colors"
            >
              Exit
            </button>
          </div>
        </nav>

        {/* Main Grid Content - Elegant Dark Style */}
        <main className="flex-1 p-10 overflow-y-auto no-scrollbar grid grid-cols-3 auto-rows-max gap-[25px]">
          {filteredItems.length === 0 ? (
            <div className="col-span-3 h-64 flex flex-col items-center justify-center text-gold-500/40 border-2 border-dashed border-sham-border rounded-xl">
              <UtensilsCrossed className="w-12 h-12 mb-4" />
              <p className="text-xl">No items available in this category yet.</p>
            </div>
          ) : (
            filteredItems.map(item => (
              <MenuItemCard 
                key={item.id} 
                item={item} 
                quantity={cart.find(i => i.id === item.id)?.quantity || 0}
                onAdd={() => onAddToCart(item)}
                onRemove={() => onRemoveFromCart(item.id)}
              />
            ))
          )}
        </main>
      </div>
      
      {/* Bottom Cart Bar - Elegant Dark Style */}
      <div className="h-[90px] bg-sham-surface border-t border-gold-500 px-10 flex items-center justify-between flex-shrink-0">
         <div className="flex flex-col">
            <span className="text-sm text-text-secondary font-medium">{cartItemCount} Items in Basket</span>
            <span className="text-3xl font-bold text-white tracking-tight">Total: {formatPrice(cartTotal)}</span>
         </div>
         
         <button
           disabled={cart.length === 0}
           onClick={() => setShowCart(true)}
           className={cn(
             "px-12 py-4 rounded-full text-lg font-bold uppercase tracking-widest transition-all shadow-lg",
             cart.length > 0 
              ? "bg-gold-500 text-black shadow-gold-500/30 hover:scale-105 active:scale-95" 
              : "bg-gray-800 text-gray-500 cursor-not-allowed"
           )}
         >
           View Order & Checkout
         </button>
      </div>

      {/* Side Cart (Overlay for Review) - Keeping existing logic but restyling if needed */}
      <AnimatePresence>
        {showCart && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCart(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-40"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-xl bg-sham-surface z-50 flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.5)] border-l border-gold-500/20"
            >
              <div className="p-8 border-b border-sham-border flex justify-between items-center">
                <h3 className="text-3xl font-serif gold-text-gradient">Review Order</h3>
                <button 
                  onClick={() => setShowCart(false)}
                  className="p-3 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-8 h-8 text-gold-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                    <ShoppingCart className="w-20 h-20 mb-4" />
                    <p className="text-xl">Your cart is empty</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="flex gap-4 items-center bg-sham-dark/50 p-4 rounded-2xl border border-sham-border">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-20 h-20 object-cover rounded-xl"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1">
                        <h4 className="font-serif text-xl">{item.name}</h4>
                        <p className="text-gold-500/60">{formatPrice(item.price)}</p>
                      </div>
                      <div className="flex items-center gap-3 bg-sham-surface p-2 rounded-xl border border-gold-500/20">
                        <button onClick={() => onRemoveFromCart(item.id)} className="p-1 text-gold-500/50 hover:text-gold-500">
                          <Minus className="w-5 h-5" />
                        </button>
                        <span className="text-lg font-bold min-w-[1.5rem] text-center">{item.quantity}</span>
                        <button onClick={() => onAddToCart(item)} className="p-1 text-gold-500/50 hover:text-gold-500">
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-8 bg-sham-dark border-t border-sham-border space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-2xl text-gold-500/60 font-serif lowercase italic">Total amount</span>
                  <span className="text-4xl font-serif font-bold text-gold-400">{formatPrice(cartTotal)}</span>
                </div>
                
                <button
                  onClick={onSubmit}
                  disabled={cart.length === 0}
                  className="w-full py-6 rounded-2xl gold-gradient text-sham-dark text-2xl font-black uppercase tracking-widest shadow-2xl active:scale-95 transition-all"
                >
                  Confirm Order
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

interface MenuItemCardProps {
  item: MenuItem;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
}

function MenuItemCard({ item, quantity, onAdd, onRemove }: MenuItemCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-sham-surface border border-sham-border rounded-xl overflow-hidden flex flex-col h-full"
    >
      <div className="relative h-[160px] bg-linear-to-br from-[#1f1f22] to-[#2a2a2e] border-b border-sham-border flex items-center justify-center">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover opacity-60 mix-blend-luminosity hover:opacity-100 transition-opacity duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <span className="text-gold-500/30 font-serif italic text-sm text-center px-4 uppercase tracking-widest">{item.name}</span>
        </div>
      </div>
      
      <div className="p-[15px] flex flex-col flex-1">
        <h3 className="text-lg font-bold mb-1 text-white">{item.name}</h3>
        <p className="text-text-secondary text-xs mb-3 flex-1 line-clamp-2 leading-relaxed">{item.description}</p>
        
        <div className="flex items-center justify-between mt-auto">
          <span className="text-lg font-bold text-gold-500">{formatPrice(item.price)}</span>
          
          <div className="flex items-center gap-2">
            <AnimatePresence mode="wait">
              {quantity > 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-2 bg-sham-dark px-2 py-1 rounded-full border border-gold-500/20"
                >
                  <button onClick={onRemove} className="w-6 h-6 flex items-center justify-center text-gold-500 hover:text-white transition-colors">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-bold w-4 text-center">{quantity}</span>
                  <button onClick={onAdd} className="w-6 h-6 flex items-center justify-center text-gold-500 hover:text-white transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </motion.div>
              ) : (
                <button
                  onClick={onAdd}
                  className="w-[35px] h-[35px] bg-gold-500 text-black rounded-full flex items-center justify-center text-xl font-bold hover:scale-110 active:scale-95 transition-all shadow-lg shadow-gold-500/20"
                >
                  +
                </button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function UtensilsCrossed(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8" />
      <path d="M15 15 3.3 3.3a2 2 0 1 0-2.8 2.8L12.2 17.8a2 2 0 1 0 2.8-2.8Z" />
      <path d="m2 22 17.6-17.6" />
    </svg>
  );
}

import React, { useState, useMemo } from 'react';
import { MenuItem, CartItem, Category, CATEGORIES_LIST } from '../types';
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
    <div className="flex flex-col h-full bg-sham-dark text-white overflow-hidden text-left">
      {/* Header - Elegant Dark Style */}
      <header className="h-20 bg-linear-to-b from-[#111] to-[#0a0a0b] border-b border-sham-border flex items-center justify-between px-10 flex-shrink-0">
        <div className="text-3xl font-serif text-gold-500 tracking-[2px] uppercase flex items-center gap-4">
          SHAMIYAT <span className="text-gold-500/60 font-serif italic text-xl">شاميات</span>
        </div>
        <div className="flex items-center gap-5">
          <button className="px-3 py-1 border border-gold-500 text-gold-500 rounded text-xs font-bold hover:bg-gold-500/10 transition-colors">FR</button>
          <button className="px-3 py-1 border border-gold-500 text-gold-500 rounded text-xs font-bold hover:bg-gold-500/10 transition-colors">AR</button>
          <div className="text-sm border-l border-white/20 pl-5 text-gray-400">
            Table #08
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation - Elegant Dark Style */}
        <nav className="w-[200px] bg-[#0c0c0e] border-r border-sham-border flex flex-col pt-5">
          {CATEGORIES_LIST.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-8 py-5 text-sm font-medium transition-all text-left uppercase tracking-widest border-l-4",
                activeCategory === cat 
                  ? "text-gold-500 border-l-gold-500 bg-gold-500/5 font-bold"
                  : "text-gray-500 border-l-transparent hover:text-gold-500/80"
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
        <main className="flex-1 p-10 overflow-y-auto no-scrollbar grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-max gap-[25px]">
          {filteredItems.length === 0 ? (
            <div className="col-span-full h-96 flex flex-col items-center justify-center text-gold-500/40 border-2 border-dashed border-sham-border rounded-[40px] bg-sham-surface/30">
              <Plus className="w-16 h-16 mb-4 opacity-10" />
              <p className="text-2xl font-serif">No {activeCategory} available today.</p>
              <p className="text-xs uppercase tracking-widest mt-2 opacity-50">Please check another category</p>
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
      <div className="h-[100px] bg-sham-surface border-t border-gold-500 px-10 flex items-center justify-between flex-shrink-0">
         <div className="flex flex-col">
            <span className="text-sm text-gray-400 font-medium tracking-widest uppercase">{cartItemCount} Items in Basket</span>
            <span className="text-4xl font-bold text-white tracking-tight">Total: {formatPrice(cartTotal)}</span>
         </div>
         
         <button
           disabled={cart.length === 0}
           onClick={() => setShowCart(true)}
           className={cn(
             "px-12 py-5 rounded-2xl text-xl font-black uppercase tracking-widest transition-all shadow-2xl",
             cart.length > 0 
              ? "bg-gold-500 text-black shadow-gold-500/30 hover:scale-[1.02] active:scale-95" 
              : "bg-gray-800 text-gray-500 cursor-not-allowed opacity-50"
           )}
         >
           View Order & Checkout
         </button>
      </div>

      {/* Side Cart (Overlay for Review) */}
      <AnimatePresence>
        {showCart && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCart(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-xl bg-sham-surface z-[70] flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.5)] border-l border-gold-500/20"
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

              <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                    <ShoppingCart className="w-20 h-20 mb-4" />
                    <p className="text-xl">Your cart is empty</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="flex gap-4 items-center bg-sham-dark/50 p-6 rounded-3xl border border-sham-border">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-xl border border-gold-500/10">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-serif text-2xl mb-1">{item.name}</h4>
                        <p className="text-gold-500 font-bold">{formatPrice(item.price)}</p>
                      </div>
                      <div className="flex items-center gap-4 bg-sham-surface p-3 rounded-2xl border border-gold-500/20 shadow-lg">
                        <button onClick={() => onRemoveFromCart(item.id)} className="p-2 text-gold-500 hover:bg-gold-500/10 rounded-lg transition-colors">
                          <Minus className="w-6 h-6" />
                        </button>
                        <span className="text-2xl font-black min-w-[2rem] text-center text-white">{item.quantity}</span>
                        <button onClick={() => onAddToCart(item)} className="p-2 text-gold-500 hover:bg-gold-500/10 rounded-lg transition-colors">
                          <Plus className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-8 bg-sham-dark border-t border-sham-border space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-2xl text-gray-500 font-serif lowercase italic">Total amount</span>
                  <span className="text-5xl font-serif font-bold text-gold-500">{formatPrice(cartTotal)}</span>
                </div>
                
                <button
                  onClick={onSubmit}
                  disabled={cart.length === 0}
                  className="w-full py-8 rounded-3xl gold-gradient text-sham-dark text-3xl font-black uppercase tracking-widest shadow-2xl active:scale-95 transition-all"
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
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-sham-surface border border-sham-border rounded-[40px] overflow-hidden flex flex-col h-full shadow-xl hover:border-gold-500/30 transition-all group"
    >
      <div className="relative h-[220px] overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-60" />
        <div className="absolute bottom-4 left-6">
           <span className="px-3 py-1 bg-gold-500/20 backdrop-blur-md rounded-full text-[10px] uppercase font-black text-gold-500 border border-gold-500/20">
              {item.category}
           </span>
        </div>
      </div>
      
      <div className="p-8 flex flex-col flex-1">
        <h3 className="text-2xl font-serif font-bold mb-2 text-white line-clamp-1">{item.name}</h3>
        <p className="text-gray-400 text-sm mb-6 flex-1 line-clamp-3 leading-relaxed">{item.description}</p>
        
        <div className="flex items-center justify-between mt-auto">
          <span className="text-2xl font-black text-gold-500 tracking-tighter">{formatPrice(item.price)}</span>
          
          <div className="flex items-center gap-2">
            <AnimatePresence mode="wait">
              {quantity > 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-4 bg-sham-dark px-4 py-2 rounded-2xl border border-gold-500/20 shadow-lg"
                >
                  <button onClick={onRemove} className="w-8 h-8 flex items-center justify-center text-gold-500 hover:text-white transition-colors">
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="text-xl font-bold w-6 text-center text-white">{quantity}</span>
                  <button onClick={onAdd} className="w-8 h-8 flex items-center justify-center text-gold-500 hover:text-white transition-colors">
                    <Plus className="w-5 h-5" />
                  </button>
                </motion.div>
              ) : (
                <button
                  onClick={onAdd}
                  className="px-8 py-3 bg-gold-500 text-black rounded-xl text-sm font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-gold-500/20"
                >
                  Add to Order
                </button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

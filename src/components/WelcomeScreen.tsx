import React from 'react';
import { Utensils, ShoppingBag, Settings } from 'lucide-react';
import { motion } from 'motion/react';

interface WelcomeScreenProps {
  onStart: (type: 'dine-in' | 'takeaway') => void;
  onAdmin: () => void;
}

export default function WelcomeScreen({ onStart, onAdmin }: WelcomeScreenProps) {
  return (
    <div className="relative h-full w-full flex flex-col items-center justify-center p-8 text-center bg-[#0a0a0b]">
      <div className="absolute inset-0 grayscale opacity-40 bg-[url('https://images.unsplash.com/photo-1541544741938-0af808b77e40?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center"></div>
      {/* Dark overlay with some texture */}
      <div className="absolute inset-0 bg-[#0a0a0b]/80 backdrop-blur-[2px]"></div>
      
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 mb-16"
      >
        <h1 className="text-7xl md:text-9xl font-serif font-bold gold-text-gradient mb-4">
          SHAMIYAT
        </h1>
        <p className="text-xl md:text-3xl font-light text-gold-200 tracking-[0.3em] uppercase">
          Authentic Levantine Taste
        </p>
      </motion.div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onStart('dine-in')}
          className="flex flex-col items-center justify-center p-12 bg-sham-surface/80 border-2 border-gold-500/30 rounded-3xl hover:border-gold-500 transition-all group"
        >
          <div className="w-24 h-24 bg-gold-500/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-gold-500/20 transition-colors">
            <Utensils className="w-12 h-12 text-gold-500" />
          </div>
          <span className="text-3xl font-serif font-medium text-white mb-2">Eat Here</span>
          <span className="text-gold-400/60 uppercase tracking-widest text-sm">Dine-In</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.href = 'https://glovoapp.com/fr/ma/technopolis/stores/shamyat-tec?utm_source=google&utm_medium=organic&utm_campaign=google_reserve_place_order_action'}
          className="flex flex-col items-center justify-center p-12 bg-sham-surface/80 border-2 border-gold-500/30 rounded-3xl hover:border-gold-500 transition-all group"
        >
          <div className="w-24 h-24 bg-gold-500/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-gold-500/20 transition-colors">
            <ShoppingBag className="w-12 h-12 text-gold-500" />
          </div>
          <span className="text-3xl font-serif font-medium text-white mb-2">Take Away</span>
          <span className="text-gold-400/60 uppercase tracking-widest text-sm">Order Online (Glovo)</span>
        </motion.button>
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        whileHover={{ opacity: 1 }}
        onClick={onAdmin}
        className="absolute bottom-8 right-8 p-4 text-gold-500"
      >
        <Settings className="w-6 h-6" />
      </motion.button>
      
      <div className="absolute bottom-8 left-8">
        <p className="text-gold-500/40 text-sm tracking-widest uppercase">
          Welcome to Shamiyat Kiosk System v1.0
        </p>
      </div>
    </div>
  );
}

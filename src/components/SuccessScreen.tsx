import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, ReceiptText, Home } from 'lucide-react';
import { Order } from '../types';
import { formatPrice } from '../lib/utils';

interface SuccessScreenProps {
  order: Order;
  onDone: () => void;
}

export default function SuccessScreen({ order, onDone }: SuccessScreenProps) {
  useEffect(() => {
    const timer = setTimeout(onDone, 10000);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-8 bg-sham-dark overflow-hidden relative">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] gold-gradient blur-[120px] rounded-full"></div>
      </div>

      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 15, stiffness: 200 }}
        className="mb-12"
      >
        <div className="w-32 h-32 bg-gold-500 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(212,175,55,0.5)]">
          <CheckCircle2 className="w-20 h-20 text-sham-dark" />
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <h2 className="text-6xl font-serif gold-text-gradient mb-6">Order Received!</h2>
        <p className="text-2xl text-gold-200/60 font-light mb-12 max-w-lg mx-auto">
          Thank you for choosing Shamiyat. Your meal is being prepared with love and tradition.
        </p>

        <div className="bg-sham-surface border-2 border-sham-border rounded-[40px] p-12 mb-12 inline-block">
          <p className="text-text-secondary uppercase tracking-[0.5em] text-xs mb-4">Your Table Number</p>
          <p className="text-9xl font-serif font-bold text-white mb-8 tracking-tighter">#{order.orderNumber}</p>
          <div className="h-px w-full bg-gold-500/20 mb-8"></div>
          <div className="flex items-center justify-center gap-3 text-gold-500">
            <ReceiptText className="w-6 h-6" />
            <span className="text-xl">Total Paid: {formatPrice(order.total)}</span>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={onDone}
            className="px-12 py-5 bg-gold-500 text-sham-dark text-xl font-bold rounded-2xl flex items-center gap-3 hover:scale-105 transition-transform"
          >
            <Home className="w-6 h-6" />
            Back to Home
          </button>
        </div>
      </motion.div>
      
      <div className="absolute bottom-12 text-gold-500/30 animate-pulse">
        Returning to welcome screen in 10s...
      </div>
    </div>
  );
}

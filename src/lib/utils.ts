import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number) {
  return `${price.toLocaleString('fr-FR')} DH`;
}

export function generateOrderNumber() {
  return Math.floor(100 + Math.random() * 900).toString();
}

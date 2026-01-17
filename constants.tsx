
import React from 'react';
import { 
  Utensils, 
  Car, 
  ShoppingBag, 
  Receipt, 
  Gamepad2, 
  Layers 
} from 'lucide-react';
import { Category } from './types';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Ovqat', icon: 'Utensils', color: '#ef4444' },
  { id: 'cat-2', name: 'Transport', icon: 'Car', color: '#3b82f6' },
  { id: 'cat-3', name: 'Xaridlar', icon: 'ShoppingBag', color: '#f59e0b' },
  { id: 'cat-4', name: 'To‘lovlar', icon: 'Receipt', color: '#10b981' },
  { id: 'cat-5', name: 'Ko‘ngilochar', icon: 'Gamepad2', color: '#8b5cf6' },
  { id: 'cat-6', name: 'Boshqalar', icon: 'Layers', color: '#6b7280' },
];

export const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case 'Utensils': return <Utensils className="w-4 h-4" />;
    case 'Car': return <Car className="w-4 h-4" />;
    case 'ShoppingBag': return <ShoppingBag className="w-4 h-4" />;
    case 'Receipt': return <Receipt className="w-4 h-4" />;
    case 'Gamepad2': return <Gamepad2 className="w-4 h-4" />;
    default: return <Layers className="w-4 h-4" />;
  }
};

/**
 * Auto Expense Categories
 * 
 * Defines expense categories with icons and colors for vehicle expenses.
 */

import { 
  Fuel, 
  Wrench, 
  ParkingCircle, 
  Shield, 
  AlertTriangle, 
  Droplets, 
  Package, 
  Circle,
  type LucideIcon
} from 'lucide-react';
import { AutoExpenseCategory } from './types';

export type CategoryDefinition = {
  id: AutoExpenseCategory;
  label: string; // Russian
  icon: LucideIcon;
  color: string; // Hex color
};

export const AUTO_CATEGORIES: CategoryDefinition[] = [
  { id: 'fuel', label: 'Топливо', icon: Fuel, color: '#f97316' }, // orange-500
  { id: 'maintenance', label: 'ТО и ремонт', icon: Wrench, color: '#3b82f6' }, // blue-500
  { id: 'parking', label: 'Парковка', icon: ParkingCircle, color: '#8b5cf6' }, // purple-500
  { id: 'insurance', label: 'Страховка', icon: Shield, color: '#10b981' }, // green-500
  { id: 'fines', label: 'Штрафы', icon: AlertTriangle, color: '#ef4444' }, // red-500
  { id: 'carwash', label: 'Мойка', icon: Droplets, color: '#06b6d4' }, // cyan-500
  { id: 'parts', label: 'Запчасти', icon: Package, color: '#f59e0b' }, // amber-500
  { id: 'tires', label: 'Шины', icon: Circle, color: '#64748b' }, // slate-500
];

/**
 * Get category definition by ID
 */
export function getCategoryById(id: AutoExpenseCategory): CategoryDefinition | undefined {
  return AUTO_CATEGORIES.find(cat => cat.id === id);
}

/**
 * Get category color by ID
 */
export function getCategoryColor(id: AutoExpenseCategory): string {
  const category = getCategoryById(id);
  return category?.color || '#71717a'; // zinc-500 as fallback
}

/**
 * Get category icon by ID
 */
export function getCategoryIcon(id: AutoExpenseCategory): LucideIcon {
  const category = getCategoryById(id);
  return category?.icon || Circle; // Circle as fallback
}

/**
 * Get category label by ID
 */
export function getCategoryLabel(id: AutoExpenseCategory): string {
  const category = getCategoryById(id);
  return category?.label || 'Другое';
}

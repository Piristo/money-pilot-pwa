import { useMemo } from 'react';
import { useAppStore } from '@/lib/app-store';
import { DateUtils } from '../utils/date-utils';
import { FinancialMath } from '../utils/financial-math';

/**
 * useDailyBudget - Calculate recommended daily spending
 * 
 * Divides remaining budget by days left in month to provide a daily spending target.
 * 
 * @returns Daily budget amount (whole number)
 */
export function useDailyBudget(): number {
  const { budgets } = useAppStore();

  return useMemo(() => {
    // Calculate total remaining budget
    const totalRemaining = budgets.reduce((sum, b) => {
      const remaining = b.limit - b.used;
      return sum + remaining;
    }, 0);

    // If negative, return 0
    if (totalRemaining <= 0) return 0;

    // Get days remaining in month
    const today = new Date();
    const daysRemaining = DateUtils.getDaysRemainingInMonth(today);

    // If no days remaining or negative, return full remaining budget
    if (daysRemaining <= 0) return Math.round(totalRemaining);

    // Calculate daily budget
    const dailyBudget = totalRemaining / daysRemaining;

    return Math.round(dailyBudget);
  }, [budgets]);
}

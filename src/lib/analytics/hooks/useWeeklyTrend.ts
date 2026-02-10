import { useMemo } from 'react';
import { useAppStore } from '@/lib/app-store';
import { WeeklyTrend } from '../types';
import { DateUtils } from '../utils/date-utils';
import { FinancialMath } from '../utils/financial-math';

/**
 * useWeeklyTrend - Calculate weekly spending trend
 * 
 * Compares current week expenses to previous week and calculates percentage change.
 * 
 * @returns WeeklyTrend object with current/previous amounts and percentage change
 */
export function useWeeklyTrend(): WeeklyTrend {
  const { transactions } = useAppStore();

  return useMemo(() => {
    const today = new Date();
    
    // Get current week boundaries
    const currentWeekRange = DateUtils.getWeekBoundaries(today);
    
    // Get previous week boundaries
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    const previousWeekRange = DateUtils.getWeekBoundaries(lastWeek);

    // Calculate current week expenses
    const currentWeek = transactions
      .filter((t) => t.type === 'expense')
      .filter((t) => {
        const date = DateUtils.parseTransactionDate(t.date);
        return DateUtils.isInRange(date, currentWeekRange);
      })
      .reduce((sum, t) => sum + t.amount, 0);

    // Calculate previous week expenses
    const previousWeek = transactions
      .filter((t) => t.type === 'expense')
      .filter((t) => {
        const date = DateUtils.parseTransactionDate(t.date);
        return DateUtils.isInRange(date, previousWeekRange);
      })
      .reduce((sum, t) => sum + t.amount, 0);

    // Calculate percentage change
    const percentageChange = FinancialMath.percentageChange(previousWeek, currentWeek);

    // Determine direction
    let direction: 'up' | 'down' | 'neutral' = 'neutral';
    if (percentageChange !== null) {
      if (percentageChange > 0) direction = 'up';
      else if (percentageChange < 0) direction = 'down';
    }

    return {
      currentWeek,
      previousWeek,
      percentageChange: percentageChange !== null ? FinancialMath.round(percentageChange, 0) : null,
      direction,
    };
  }, [transactions]);
}

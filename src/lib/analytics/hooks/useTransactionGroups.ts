import { useMemo } from 'react';
import { useAppStore } from '@/lib/app-store';
import { TransactionGroup } from '../types';
import { DateUtils } from '../utils/date-utils';

/**
 * useTransactionGroups - Group transactions by date
 * 
 * Groups transactions by date for organized display with daily totals.
 * 
 * @returns Array of TransactionGroup sorted by date (newest first)
 */
export function useTransactionGroups(): TransactionGroup[] {
  const { transactions, locale } = useAppStore();

  return useMemo(() => {
    // Group transactions by ISO date
    const groups = new Map<string, TransactionGroup>();

    transactions.forEach((transaction) => {
      const date = DateUtils.parseTransactionDate(transaction.date);
      const isoDate = DateUtils.toISODate(date);

      if (!groups.has(isoDate)) {
        groups.set(isoDate, {
          date: isoDate,
          displayDate: DateUtils.formatForDisplay(date, locale),
          transactions: [],
          totalIncome: 0,
          totalExpense: 0,
          netAmount: 0,
        });
      }

      const group = groups.get(isoDate)!;
      group.transactions.push(transaction);

      if (transaction.type === 'income') {
        group.totalIncome += transaction.amount;
      } else {
        group.totalExpense += transaction.amount;
      }
    });

    // Calculate net amounts and sort by date (newest first)
    const result = Array.from(groups.values())
      .map((group) => ({
        ...group,
        netAmount: group.totalIncome - group.totalExpense,
      }))
      .sort((a, b) => b.date.localeCompare(a.date));

    return result;
  }, [transactions, locale]);
}

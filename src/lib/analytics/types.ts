/**
 * Analytics Types for MoneyPilot
 * 
 * Type definitions for all analytics calculations and data structures.
 */

import { Transaction, Budget, AutoExpense } from '@/lib/app-store';

// Date range for filtering
export interface DateRange {
  start: Date;
  end: Date;
}

// Weekly trend result
export interface WeeklyTrend {
  currentWeek: number;
  previousWeek: number;
  percentageChange: number | null;
  direction: 'up' | 'down' | 'neutral';
}

// Budget health status
export type BudgetHealth = 'on-track' | 'warning' | 'overspent';

// Category analytics with health indicators
export interface CategoryAnalytics {
  id: number;
  name: string;
  used: number;
  limit: number;
  utilizationPercent: number;
  percentOfTotal: number;
  health: BudgetHealth;
  color: string;
}

// Income vs expense summary
export interface IncomeExpenseSummary {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  savingsRate: number | null;
}

// Auto metrics
export interface AutoMetrics {
  totalMonthlyExpenses: number;
  costPerKm: number | null;
  averageFuelCost: number;
  fuelTransactionCount: number;
}

// Transaction group by date
export interface TransactionGroup {
  date: string; // ISO format YYYY-MM-DD
  displayDate: string; // Localized display
  transactions: Transaction[];
  totalIncome: number;
  totalExpense: number;
  netAmount: number;
}

// Chart data format
export interface ChartData {
  labels: string[];
  values: number[];
  colors?: string[];
}

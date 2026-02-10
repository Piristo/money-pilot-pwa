/**
 * Vehicle Metrics Calculator
 * 
 * Calculates various vehicle-related financial and consumption metrics.
 */

import { CarProfile, FuelLog, MaintenanceLog, VehicleMetrics, AutoExpense } from './types';
import { calculateRealConsumption, getAverageConsumption } from './fuel-calculator';

/**
 * Calculate cost per kilometer
 * 
 * @param totalExpenses - Total expenses in rubles
 * @param totalMileage - Total mileage driven in kilometers
 * @returns Cost per km in ₽/km
 */
export function calculateCostPerKm(totalExpenses: number, totalMileage: number): number {
  if (totalMileage <= 0) {
    return 0;
  }
  
  const costPerKm = totalExpenses / totalMileage;
  return Math.round(costPerKm * 100) / 100; // Round to 2 decimal places
}

/**
 * Calculate monthly forecast based on historical average
 * 
 * @param expenses - Array of expenses with date and amount
 * @param months - Number of months to consider for average
 * @returns Forecasted monthly expense in rubles
 */
export function calculateMonthlyForecast(
  expenses: Array<{ date: string; amount: number }>,
  months: number = 3
): number {
  if (expenses.length === 0) {
    return 0;
  }
  
  // Get date N months ago
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - months);
  
  // Filter expenses within the time range
  const recentExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= cutoffDate;
  });
  
  if (recentExpenses.length === 0) {
    return 0;
  }
  
  // Calculate total
  const total = recentExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Calculate actual months span
  const oldestDate = new Date(Math.min(...recentExpenses.map(e => new Date(e.date).getTime())));
  const newestDate = new Date(Math.max(...recentExpenses.map(e => new Date(e.date).getTime())));
  const monthsSpan = (newestDate.getTime() - oldestDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
  const actualMonths = Math.max(monthsSpan, 1); // At least 1 month
  
  // Calculate average per month
  const monthlyAverage = total / actualMonths;
  
  return Math.round(monthlyAverage);
}

/**
 * Calculate comprehensive vehicle metrics
 * 
 * @param carProfile - Vehicle profile with specs
 * @param fuelLogs - Array of fuel logs
 * @param maintenanceLogs - Array of maintenance logs
 * @param autoExpenses - Array of auto expenses
 * @param timeRangeMonths - Number of months to consider for calculations
 * @returns Complete vehicle metrics object
 */
export function calculateMetrics(
  carProfile: CarProfile | null,
  fuelLogs: FuelLog[],
  maintenanceLogs: MaintenanceLog[],
  autoExpenses: AutoExpense[],
  timeRangeMonths: number = 12
): VehicleMetrics {
  // Default metrics if no car profile
  if (!carProfile) {
    return {
      costPerKm: 0,
      avgFuelConsumption: 0,
      monthlyForecast: 0,
      fullTankCost: 0,
      rangeOnFullTank: 0,
      avgFillupCost: 0,
      monthlyMileage: 0,
    };
  }
  
  // Calculate real fuel consumption
  const consumptionDataPoints = calculateRealConsumption(fuelLogs);
  const avgFuelConsumption = consumptionDataPoints.length > 0
    ? getAverageConsumption(consumptionDataPoints)
    : carProfile.fuelConsumption; // Fallback to manufacturer spec
  
  // Calculate full tank cost
  const fullTankCost = carProfile.tankCapacity * carProfile.fuelPrice;
  
  // Calculate range on full tank
  const rangeOnFullTank = avgFuelConsumption > 0
    ? (carProfile.tankCapacity / avgFuelConsumption) * 100
    : 0;
  
  // Calculate average fillup cost
  const avgFillupCost = fuelLogs.length > 0
    ? fuelLogs.reduce((sum, log) => sum + log.amount, 0) / fuelLogs.length
    : 0;
  
  // Calculate total expenses (fuel + maintenance + other auto expenses)
  const fuelExpenses = fuelLogs.map(log => ({ date: log.date, amount: log.amount }));
  const maintenanceExpenses = maintenanceLogs.map(log => ({ date: log.date, amount: log.amount }));
  const otherExpenses = autoExpenses.map(exp => ({ date: exp.date, amount: exp.amount }));
  const allExpenses = [...fuelExpenses, ...maintenanceExpenses, ...otherExpenses];
  
  // Calculate monthly forecast
  const monthlyForecast = calculateMonthlyForecast(allExpenses, 3);
  
  // Calculate monthly mileage
  const monthlyMileage = calculateMonthlyMileage(fuelLogs, timeRangeMonths);
  
  // Calculate cost per km
  const totalExpenses = allExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalMileage = calculateTotalMileage(fuelLogs);
  const costPerKm = calculateCostPerKm(totalExpenses, totalMileage);
  
  return {
    costPerKm: Math.round(costPerKm * 100) / 100,
    avgFuelConsumption: Math.round(avgFuelConsumption * 100) / 100,
    monthlyForecast: Math.round(monthlyForecast),
    fullTankCost: Math.round(fullTankCost),
    rangeOnFullTank: Math.round(rangeOnFullTank),
    avgFillupCost: Math.round(avgFillupCost),
    monthlyMileage: Math.round(monthlyMileage),
  };
}

/**
 * Calculate total mileage from fuel logs
 * 
 * @param fuelLogs - Array of fuel logs
 * @returns Total mileage driven
 */
function calculateTotalMileage(fuelLogs: FuelLog[]): number {
  if (fuelLogs.length < 2) {
    return 0;
  }
  
  // Sort by date
  const sorted = [...fuelLogs].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  // Difference between first and last mileage
  const firstMileage = sorted[0].mileage;
  const lastMileage = sorted[sorted.length - 1].mileage;
  
  return lastMileage - firstMileage;
}

/**
 * Calculate average monthly mileage
 * 
 * @param fuelLogs - Array of fuel logs
 * @param months - Number of months to consider
 * @returns Average monthly mileage
 */
function calculateMonthlyMileage(fuelLogs: FuelLog[], months: number): number {
  if (fuelLogs.length < 2) {
    return 0;
  }
  
  // Get date N months ago
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - months);
  
  // Filter recent logs
  const recentLogs = fuelLogs.filter(log => {
    const logDate = new Date(log.date);
    return logDate >= cutoffDate;
  });
  
  if (recentLogs.length < 2) {
    return 0;
  }
  
  // Sort by date
  const sorted = [...recentLogs].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  // Calculate mileage difference
  const firstMileage = sorted[0].mileage;
  const lastMileage = sorted[sorted.length - 1].mileage;
  const mileageDiff = lastMileage - firstMileage;
  
  // Calculate time span in months
  const firstDate = new Date(sorted[0].date);
  const lastDate = new Date(sorted[sorted.length - 1].date);
  const timeSpan = (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
  const actualMonths = Math.max(timeSpan, 1); // At least 1 month
  
  // Calculate average per month
  return mileageDiff / actualMonths;
}

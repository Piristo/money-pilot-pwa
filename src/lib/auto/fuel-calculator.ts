/**
 * Fuel Consumption Calculator
 * 
 * Calculates real fuel consumption from consecutive full-tank refueling records.
 */

import { FuelLog, ConsumptionDataPoint } from './types';

/**
 * Calculate real fuel consumption from consecutive full-tank logs
 * 
 * Algorithm:
 * 1. Filter logs where fullTank === true
 * 2. Sort by date ascending
 * 3. For each consecutive pair:
 *    - Calculate mileage difference: Δkm = currentLog.mileage - previousLog.mileage
 *    - Calculate consumption: L/100km = (currentLog.liters / Δkm) * 100
 * 4. Return array of data points
 * 
 * @param fuelLogs - Array of fuel logs
 * @returns Array of consumption data points
 */
export function calculateRealConsumption(fuelLogs: FuelLog[]): ConsumptionDataPoint[] {
  // Filter full-tank logs only
  const fullTankLogs = fuelLogs.filter(log => log.fullTank);
  
  // Sort by date ascending
  const sortedLogs = [...fullTankLogs].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  // Need at least 2 logs to calculate consumption
  if (sortedLogs.length < 2) {
    return [];
  }
  
  const dataPoints: ConsumptionDataPoint[] = [];
  
  // Calculate consumption between consecutive pairs
  for (let i = 1; i < sortedLogs.length; i++) {
    const previousLog = sortedLogs[i - 1];
    const currentLog = sortedLogs[i];
    
    const consumption = calculateConsumptionBetweenFillups(previousLog, currentLog);
    
    if (consumption !== null) {
      dataPoints.push({
        date: currentLog.date,
        consumption,
        mileage: currentLog.mileage
      });
    }
  }
  
  return dataPoints;
}

/**
 * Calculate consumption between two consecutive full-tank fillups
 * 
 * @param previousLog - Previous full-tank log
 * @param currentLog - Current full-tank log
 * @returns Consumption in L/100km or null if invalid
 */
export function calculateConsumptionBetweenFillups(
  previousLog: FuelLog,
  currentLog: FuelLog
): number | null {
  const mileageDiff = currentLog.mileage - previousLog.mileage;
  
  // Invalid if mileage difference is zero or negative
  if (mileageDiff <= 0) {
    return null;
  }
  
  // Calculate consumption: (liters / km) * 100 = L/100km
  const consumption = (currentLog.liters / mileageDiff) * 100;
  
  // Return rounded to 2 decimal places
  return Math.round(consumption * 100) / 100;
}

/**
 * Calculate average consumption from data points
 * 
 * @param dataPoints - Array of consumption data points
 * @returns Average consumption in L/100km
 */
export function getAverageConsumption(dataPoints: ConsumptionDataPoint[]): number {
  if (dataPoints.length === 0) {
    return 0;
  }
  
  const sum = dataPoints.reduce((total, point) => total + point.consumption, 0);
  const average = sum / dataPoints.length;
  
  // Return rounded to 2 decimal places
  return Math.round(average * 100) / 100;
}

/**
 * Get consumption trend (increasing, decreasing, stable)
 * 
 * @param dataPoints - Array of consumption data points
 * @returns Trend direction
 */
export function getConsumptionTrend(
  dataPoints: ConsumptionDataPoint[]
): 'increasing' | 'decreasing' | 'stable' {
  if (dataPoints.length < 2) {
    return 'stable';
  }
  
  // Compare first half average with second half average
  const midpoint = Math.floor(dataPoints.length / 2);
  const firstHalf = dataPoints.slice(0, midpoint);
  const secondHalf = dataPoints.slice(midpoint);
  
  const firstAvg = getAverageConsumption(firstHalf);
  const secondAvg = getAverageConsumption(secondHalf);
  
  const difference = secondAvg - firstAvg;
  const threshold = 0.5; // L/100km
  
  if (difference > threshold) {
    return 'increasing';
  } else if (difference < -threshold) {
    return 'decreasing';
  } else {
    return 'stable';
  }
}

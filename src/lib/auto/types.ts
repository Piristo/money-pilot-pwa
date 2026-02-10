/**
 * Auto Module Type Definitions
 * 
 * TypeScript types for vehicle tracking, fuel logs, maintenance records, and reminders.
 */

export type CarProfile = {
  brand: string;
  model: string;
  year: number;
  mileage: number;
  fuelConsumption: number; // L/100km (manufacturer spec)
  fuelType: 'АИ-92' | 'АИ-95' | 'АИ-98' | 'ДТ';
  tankCapacity: number; // liters
  fuelPrice: number; // ₽/liter
};

export type FuelLog = {
  id: number;
  date: string; // ISO 8601
  liters: number;
  amount: number; // ₽
  mileage: number; // km
  pricePerLiter: number; // ₽/L (calculated)
  fuelType: string;
  station: string;
  fullTank: boolean;
};

export type MaintenanceLog = {
  id: number;
  date: string; // ISO 8601
  type: 'maintenance' | 'repair';
  category: string; // 'oil', 'tires', 'brakes', etc.
  description: string;
  amount: number; // ₽
  mileage: number; // km
  workshop: string;
  nextServiceMileage?: number;
  nextServiceDate?: string;
};

export type AutoExpenseCategory = 
  | 'fuel' 
  | 'maintenance' 
  | 'parking' 
  | 'insurance' 
  | 'fines' 
  | 'carwash'
  | 'parts'
  | 'tires';

export type AutoExpense = {
  id: number;
  title: string;
  amount: number;
  date: string;
};

export type Reminder = {
  id: number;
  title: string;
  type: 'mileage' | 'date' | 'recurring';
  targetMileage?: number;
  targetDate?: string;
  recurrence?: 'weekly' | 'monthly' | 'yearly';
  completed: boolean;
  createdAt: string;
};

export type VehicleMetrics = {
  costPerKm: number; // ₽/km
  avgFuelConsumption: number; // L/100km (real)
  monthlyForecast: number; // ₽
  fullTankCost: number; // ₽
  rangeOnFullTank: number; // km
  avgFillupCost: number; // ₽
  monthlyMileage: number; // km
};

export type ConsumptionDataPoint = {
  date: string;
  consumption: number; // L/100km
  mileage: number;
};

export type ReminderStatus = {
  id: number;
  isOverdue: boolean;
  remainingDays?: number;
  remainingKm?: number;
  displayText: string; // "Через 5 дней" or "Просрочено на 200 км"
};

'use client';

import { useAppStore } from '@/lib/app-store';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Car,
  Fuel,
  Wrench,
  TrendingUp,
  Gauge,
  Settings,
  DollarSign,
} from 'lucide-react';
import { MetricsCard } from '@/components/auto/MetricsCard';
import { FuelChart } from '@/components/auto/FuelChart';
import { ExpenseCategoryChart } from '@/components/auto/ExpenseCategoryChart';
import { ReminderCard } from '@/components/auto/ReminderCard';
import { FuelLogForm } from '@/components/auto/FuelLogForm';
import { MaintenanceLogForm } from '@/components/auto/MaintenanceLogForm';
import { calculateMetrics } from '@/lib/auto/metrics';
import { calculateRealConsumption, getAverageConsumption } from '@/lib/auto/fuel-calculator';
import { getReminderStatus, sortRemindersByUrgency, getActiveReminders } from '@/lib/auto/reminders';
import { AutoExpenseCategory } from '@/lib/auto/types';

export default function AutoPage() {
  const {
    carProfile,
    fuelLogs,
    maintenanceLogs,
    autoReminders,
  } = useAppStore();

  const [showFuelForm, setShowFuelForm] = useState(false);
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);

  // Calculate metrics
  const metrics = useMemo(() => {
    if (!carProfile) return null;
    // Note: autoExpenses is from old store, we'll pass empty array for now
    return calculateMetrics(carProfile, fuelLogs, maintenanceLogs, [], 12);
  }, [fuelLogs, maintenanceLogs, carProfile]);

  // Calculate fuel consumption data
  const consumptionData = useMemo(() => {
    return calculateRealConsumption(fuelLogs);
  }, [fuelLogs]);

  const avgConsumption = useMemo(() => {
    const dataPoints = calculateRealConsumption(fuelLogs);
    return getAverageConsumption(dataPoints);
  }, [fuelLogs]);

  // Calculate expense distribution by category
  const expensesByCategory = useMemo(() => {
    const categoryTotals = new Map<AutoExpenseCategory, number>();

    // Add fuel expenses
    fuelLogs.forEach((log) => {
      const current = categoryTotals.get('fuel') || 0;
      categoryTotals.set('fuel', current + log.amount);
    });

    // Add maintenance expenses
    maintenanceLogs.forEach((log) => {
      const category = log.category as AutoExpenseCategory;
      const current = categoryTotals.get(category) || 0;
      categoryTotals.set(category, current + log.amount);
    });

    const total = Array.from(categoryTotals.values()).reduce((sum, val) => sum + val, 0);

    if (total === 0) return [];

    return Array.from(categoryTotals.entries()).map(([category, amount]) => ({
      category,
      amount,
      percentage: (amount / total) * 100,
    }));
  }, [fuelLogs, maintenanceLogs]);

  // Get active reminders sorted by urgency
  const activeReminders = useMemo(() => {
    const active = getActiveReminders(autoReminders);
    return sortRemindersByUrgency(active, carProfile?.mileage || 0);
  }, [autoReminders, carProfile]);

  // Empty state
  if (!carProfile) {
    return (
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <div className="text-center py-20">
          <Car className="w-20 h-20 mx-auto mb-4 text-zinc-600" />
          <h2 className="text-2xl font-bold text-white mb-2">Настройте профиль автомобиля</h2>
          <p className="text-zinc-400 mb-6">
            Добавьте информацию о вашем автомобиле, чтобы начать отслеживать расходы
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/auto/settings'}
            className="px-6 py-3 rounded-xl font-semibold text-black transition-all inline-flex items-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)',
              boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
            }}
          >
            <Settings className="w-5 h-5" />
            Настроить профиль
          </motion.button>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 pb-20"
    >
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
            Мой Гараж
          </h1>
          <p className="text-sm text-zinc-400 font-medium mt-1">
            {carProfile.brand} {carProfile.model} {carProfile.year}
          </p>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFuelForm(true)}
            className="px-4 py-2 rounded-xl font-medium text-white transition-all flex items-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
              boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)',
            }}
          >
            <Fuel className="w-4 h-4" />
            Заправка
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMaintenanceForm(true)}
            className="px-4 py-2 rounded-xl font-medium text-white transition-all flex items-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
            }}
          >
            <Wrench className="w-4 h-4" />
            ТО
          </motion.button>
        </div>
      </header>

      {/* Metrics Cards */}
      {metrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricsCard
            icon={DollarSign}
            label="Расходы в месяц"
            value={metrics.monthlyForecast.toLocaleString('ru-RU')}
            unit="₽"
            color="#22c55e"
          />
          <MetricsCard
            icon={Fuel}
            label="Средний расход"
            value={avgConsumption > 0 ? avgConsumption.toFixed(1) : carProfile.fuelConsumption.toFixed(1)}
            unit="л/100км"
            color="#f97316"
          />
          <MetricsCard
            icon={TrendingUp}
            label="Стоимость за км"
            value={metrics.costPerKm.toFixed(2)}
            unit="₽/км"
            color="#8b5cf6"
          />
          <MetricsCard
            icon={Gauge}
            label="Пробег в месяц"
            value={metrics.monthlyMileage.toLocaleString('ru-RU')}
            unit="км"
            color="#06b6d4"
          />
        </div>
      )}

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Fuel Consumption Chart */}
        <div
          className="rounded-2xl p-6"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
            backdropFilter: 'blur(30px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
          }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Расход топлива</h3>
          <FuelChart data={consumptionData} manufacturerSpec={carProfile.fuelConsumption} />
        </div>

        {/* Expense Distribution Chart */}
        <div
          className="rounded-2xl p-6"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
            backdropFilter: 'blur(30px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
          }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Распределение расходов</h3>
          <ExpenseCategoryChart data={expensesByCategory} />
        </div>
      </div>

      {/* Reminders */}
      {activeReminders.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Напоминания</h3>
          <div className="space-y-3">
            {activeReminders.slice(0, 5).map((reminder) => (
              <ReminderCard
                key={reminder.id}
                reminder={reminder}
                status={getReminderStatus(reminder, carProfile.mileage)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Forms */}
      <AnimatePresence>
        {showFuelForm && <FuelLogForm onClose={() => setShowFuelForm(false)} />}
        {showMaintenanceForm && <MaintenanceLogForm onClose={() => setShowMaintenanceForm(false)} />}
      </AnimatePresence>
    </motion.section>
  );
}



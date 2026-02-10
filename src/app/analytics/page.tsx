"use client";

import { motion } from "framer-motion";
import { useAppStore } from "@/lib/app-store";
import { useCategoryStats } from "@/lib/analytics/hooks/useCategoryStats";
import { useWeeklyTrend } from "@/lib/analytics/hooks/useWeeklyTrend";
import { PieChart } from "@/components/charts/PieChart";
import { LineChart } from "@/components/charts/LineChart";
import { TrendingUp, TrendingDown, Minus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

export default function AnalyticsPage() {
  const { transactions } = useAppStore();
  const { stats: expenseStats, total: totalExpense } = useCategoryStats("expense");
  const { stats: incomeStats, total: totalIncome } = useCategoryStats("income");
  const weeklyTrend = useWeeklyTrend();

  // Подготовка данных для круговой диаграммы (топ-5 категорий)
  const pieData = useMemo(() => {
    const top5 = expenseStats.slice(0, 5);
    const others = expenseStats.slice(5);
    
    const data = top5.map(stat => ({
      name: stat.name,
      value: stat.amount,
      color: stat.color
    }));

    if (others.length > 0) {
      const othersAmount = others.reduce((sum, stat) => sum + stat.amount, 0);
      data.push({
        name: "Другое",
        value: othersAmount,
        color: "#71717a"
      });
    }

    return data;
  }, [expenseStats]);

  // Подготовка данных для линейного графика (последние 7 дней)
  const lineData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date;
    });

    return last7Days.map(date => {
      const dateStr = date.toISOString().split('T')[0];
      
      const dayTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.toISOString().split('T')[0] === dateStr;
      });

      const income = dayTransactions
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

      const expense = dayTransactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        name: date.toLocaleDateString("ru-RU", { day: "numeric", month: "short" }),
        income,
        expense
      };
    });
  }, [transactions]);

  const netBalance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? ((netBalance / totalIncome) * 100) : 0;

  return (
    <div className="min-h-screen bg-zinc-950 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 glass-panel border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-xl glass-panel hover:bg-white/5 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-zinc-400" />
              </motion.button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Аналитика</h1>
              <p className="text-sm text-zinc-500">Визуализация ваших финансов</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Total Income */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-rich rounded-2xl p-6"
          >
            <p className="text-sm text-zinc-500 mb-2">Доходы</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
              ₽{totalIncome.toLocaleString("ru-RU")}
            </p>
          </motion.div>

          {/* Total Expense */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-rich rounded-2xl p-6"
          >
            <p className="text-sm text-zinc-500 mb-2">Расходы</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-rose-400 to-red-500 bg-clip-text text-transparent">
              ₽{totalExpense.toLocaleString("ru-RU")}
            </p>
          </motion.div>

          {/* Net Balance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-rich rounded-2xl p-6"
          >
            <p className="text-sm text-zinc-500 mb-2">Баланс</p>
            <p className={`text-3xl font-bold ${netBalance >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
              ₽{netBalance.toLocaleString("ru-RU")}
            </p>
            {totalIncome > 0 && (
              <p className="text-xs text-zinc-600 mt-1">
                Норма сбережений: {savingsRate.toFixed(1)}%
              </p>
            )}
          </motion.div>
        </div>

        {/* Weekly Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-rich rounded-2xl p-6"
        >
          <h2 className="text-lg font-semibold text-white mb-4">Недельный тренд</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-zinc-500 mb-1">Текущая неделя</p>
              <p className="text-2xl font-bold text-white">
                ₽{weeklyTrend.currentWeek.toLocaleString("ru-RU")}
              </p>
            </div>
            <div>
              <p className="text-sm text-zinc-500 mb-1">Прошлая неделя</p>
              <p className="text-2xl font-bold text-zinc-400">
                ₽{weeklyTrend.previousWeek.toLocaleString("ru-RU")}
              </p>
            </div>
          </div>
          {weeklyTrend.percentageChange !== null && (
            <div className="mt-4 flex items-center gap-2">
              {weeklyTrend.direction === "up" && (
                <>
                  <TrendingUp className="w-5 h-5 text-rose-400" />
                  <span className="text-rose-400 font-semibold">
                    +{weeklyTrend.percentageChange}% больше
                  </span>
                </>
              )}
              {weeklyTrend.direction === "down" && (
                <>
                  <TrendingDown className="w-5 h-5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">
                    {weeklyTrend.percentageChange}% меньше
                  </span>
                </>
              )}
              {weeklyTrend.direction === "neutral" && (
                <>
                  <Minus className="w-5 h-5 text-zinc-400" />
                  <span className="text-zinc-400 font-semibold">Без изменений</span>
                </>
              )}
            </div>
          )}
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart - Expenses by Category */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="glass-rich rounded-2xl p-6"
          >
            <h2 className="text-lg font-semibold text-white mb-4">Расходы по категориям</h2>
            <div className="h-80">
              {pieData.length > 0 ? (
                <PieChart data={pieData} currency="₽" />
              ) : (
                <div className="h-full flex items-center justify-center text-zinc-600">
                  <p>Нет данных о расходах</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Line Chart - Income vs Expense Trend */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="glass-rich rounded-2xl p-6"
          >
            <h2 className="text-lg font-semibold text-white mb-4">Доходы и расходы (7 дней)</h2>
            <div className="h-80">
              {lineData.length > 0 ? (
                <LineChart data={lineData} currency="₽" showIncome showExpense />
              ) : (
                <div className="h-full flex items-center justify-center text-zinc-600">
                  <p>Нет данных о транзакциях</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Category Details */}
        {expenseStats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="glass-rich rounded-2xl p-6"
          >
            <h2 className="text-lg font-semibold text-white mb-4">Детализация по категориям</h2>
            <div className="space-y-3">
              {expenseStats.map((stat, index) => (
                <motion.div
                  key={stat.categoryId + (stat.subcategoryId || "")}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-xl glass-panel hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: stat.color }}
                    />
                    <div>
                      <p className="text-white font-medium">{stat.name}</p>
                      <p className="text-xs text-zinc-500">{stat.count} транзакций</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">
                      ₽{stat.amount.toLocaleString("ru-RU")}
                    </p>
                    <p className="text-xs text-zinc-500">{stat.percentage.toFixed(1)}%</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useAppStore } from "@/lib/app-store";
import { TrendingUp, ShoppingCart, CreditCard, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { useWeeklyTrend, useDailyBudget } from "@/lib/analytics";

export default function Home() {
  const { transactions, budgets, autoExpenses, currency } = useAppStore();
  
  // Use real analytics hooks
  const weeklyTrend = useWeeklyTrend();
  const dailyBudget = useDailyBudget();

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  // Real budget calculations
  const totalBudgetLimit = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalBudgetUsed = budgets.reduce((sum, b) => sum + b.used, 0);
  const available = totalBudgetLimit - totalBudgetUsed;
  const budgetUtilization = totalBudgetLimit > 0 ? (totalBudgetUsed / totalBudgetLimit) * 100 : 0;

  const currencySign = currency === "RUB" ? "₽" : currency;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 overflow-hidden relative shadow-lg glow-green"
          >
            {/* Avatar with gradient */}
            <div className="absolute inset-0 flex items-center justify-center text-base font-bold text-white">
              Н
            </div>
          </motion.div>
          <div>
            <p className="text-zinc-500 text-sm font-medium">Привет, Николай 👋</p>
            <h1 className="text-2xl font-bold text-white leading-tight mt-1">
              Финансовый обзор
            </h1>
          </div>
        </div>
        <div className="flex gap-2">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="h-11 w-11 flex items-center justify-center rounded-xl glass-panel text-zinc-400 hover:text-white transition-colors cursor-pointer shadow-lg"
            aria-label="Календарь"
          >
            <Calendar size={20} />
          </motion.button>
        </div>
      </header>

      {/* Monthly Spending Tracker Card */}
      <motion.div 
        variants={item} 
        className="rounded-3xl glass-rich p-8 relative overflow-hidden"
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-violet-500/10 opacity-60" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg glow-green">
                <TrendingUp size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Трекер расходов</h3>
                <p className="text-xs text-zinc-500 font-medium">
                  Контролируйте свои финансы
                </p>
              </div>
            </div>
          </div>

          {totalBudgetLimit > 0 ? (
            <>
              {/* Custom Progress Bar */}
              <div className="mb-8">
                <div className="h-16 w-full flex items-end gap-[3px] rounded-2xl overflow-hidden bg-black/30 p-2 backdrop-blur-sm border border-white/5">
                  {/* Real progress visualization */}
                  {Array.from({ length: 40 }).map((_, i) => {
                    const isActive = (i / 40) * 100 < budgetUtilization;

                    // Color gradient logic: green -> yellow -> red
                    let colorClass = "bg-zinc-800/30";
                    let glowClass = "";
                    if (isActive) {
                      if (budgetUtilization < 70) {
                        colorClass = "bg-gradient-to-t from-emerald-500 via-emerald-400 to-emerald-300";
                        glowClass = "shadow-emerald-500/50";
                      } else if (budgetUtilization < 100) {
                        colorClass = "bg-gradient-to-t from-yellow-500 via-yellow-400 to-yellow-300";
                        glowClass = "shadow-yellow-500/50";
                      } else {
                        colorClass = "bg-gradient-to-t from-rose-500 via-rose-400 to-rose-300";
                        glowClass = "shadow-rose-500/50";
                      }
                    }

                    // Vary height for visual interest
                    const heightPercent = 50 + (i % 3) * 15;

                    return (
                      <motion.div
                        key={i}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: `${heightPercent}%`, opacity: 1 }}
                        transition={{ duration: 0.8, delay: i * 0.015, ease: "easeOut" }}
                        className={cn("flex-1 rounded-md transition-all duration-500 shadow-lg", colorClass, glowClass)}
                      />
                    )
                  })}
                </div>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs text-zinc-500 mb-2 font-semibold uppercase tracking-wider">Доступно</p>
                  <p className="text-4xl font-bold text-gradient tracking-tighter">{currencySign}{available.toLocaleString("ru-RU")}</p>
                  <p className="text-xs text-zinc-600 mt-1">в этом месяце</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-zinc-500 mb-2 font-semibold uppercase tracking-wider">Лимит</p>
                  <p className="text-2xl font-bold text-white">{currencySign}{totalBudgetLimit.toLocaleString("ru-RU")}</p>
                  <p className="text-xs text-zinc-600 mt-1">{Math.round(budgetUtilization)}% использовано</p>
                </div>
              </div>
            </>
          ) : (
            <Link href="/budgets" className="block">
              <div className="py-10 text-center hover:bg-zinc-900/50 rounded-2xl transition-all duration-300 cursor-pointer group">
                <motion.div 
                  className="mb-4 text-5xl"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  📊
                </motion.div>
                <p className="text-zinc-300 text-base mb-2 font-medium">Нет бюджетов</p>
                <p className="text-zinc-600 text-sm mb-4">Создайте первый бюджет чтобы начать отслеживание</p>
                <div className="inline-flex items-center gap-2 text-emerald-500 text-sm font-semibold group-hover:gap-3 transition-all">
                  <span>Создать бюджет</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          )}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={item} className="grid grid-cols-2 gap-4">
        {/* Weekly Trend - REAL DATA */}
        <motion.div 
          whileHover={{ scale: 1.03, y: -4 }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl glass-rich p-6 shadow-xl cursor-pointer relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className={cn(
                "h-9 w-9 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300",
                weeklyTrend.direction === 'up' ? "bg-gradient-to-br from-rose-500 to-rose-600 glow-purple" : 
                weeklyTrend.direction === 'down' ? "bg-gradient-to-br from-emerald-500 to-emerald-600 glow-green" : 
                "bg-zinc-800"
              )}>
                <TrendingUp size={16} className={cn(
                  "text-white transition-transform duration-300",
                  weeklyTrend.direction === 'down' && "rotate-180"
                )} />
              </div>
              <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Тренд</p>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className={cn(
                "text-3xl font-bold tracking-tighter",
                weeklyTrend.direction === 'up' ? "text-gradient-purple" : 
                weeklyTrend.direction === 'down' ? "text-gradient" : 
                "text-zinc-400"
              )}>
                {weeklyTrend.percentageChange !== null 
                  ? `${weeklyTrend.percentageChange > 0 ? '+' : ''}${weeklyTrend.percentageChange}%`
                  : '—'}
              </span>
            </div>
            <p className="text-[10px] text-zinc-600 font-medium">
              {weeklyTrend.direction === 'up' ? 'Больше' : weeklyTrend.direction === 'down' ? 'Меньше' : 'Как'} на прошлой неделе
            </p>
          </div>
        </motion.div>

        {/* Last Transaction */}
        <motion.div 
          whileHover={{ scale: 1.03, y: -4 }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl glass-rich p-6 shadow-xl cursor-pointer relative overflow-hidden group"
        >
          <div className={cn(
            "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300",
            transactions.length > 0 && transactions[0]?.type === "income" ? "from-emerald-500/5 to-transparent" : "from-rose-500/5 to-transparent"
          )} />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className={cn(
                "h-9 w-9 rounded-xl flex items-center justify-center shadow-lg",
                transactions.length > 0 && transactions[0]?.type === "income" 
                  ? "bg-gradient-to-br from-emerald-500 to-emerald-600 glow-green" 
                  : "bg-gradient-to-br from-rose-500 to-rose-600"
              )}>
                <ShoppingCart size={16} className="text-white" />
              </div>
              <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Последняя</p>
            </div>
            {transactions.length > 0 ? (
              <>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className={cn(
                    "text-3xl font-bold tracking-tighter",
                    transactions[0]?.type === "income" ? "text-gradient" : "text-white"
                  )}>
                    {transactions[0]?.type === "income" ? "+" : "-"}{currencySign}{transactions[0]?.amount.toLocaleString("ru-RU") || "0"}
                  </span>
                </div>
                <p className="text-[10px] text-zinc-600 truncate font-medium">{transactions[0]?.title || "Нет операций"}</p>
              </>
            ) : (
              <div className="py-2">
                <p className="text-zinc-600 text-2xl font-bold">—</p>
                <p className="text-[10px] text-zinc-700 mt-1">Нет операций</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Budget Remaining */}
        <motion.div 
          whileHover={{ scale: 1.03, y: -4 }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl glass-rich p-6 shadow-xl cursor-pointer relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <CreditCard size={16} className="text-white" />
              </div>
              <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Счёт</p>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-gradient-purple text-3xl font-bold tracking-tighter">
                {totalBudgetLimit > 0 ? Math.round(budgetUtilization) : 0}%
              </span>
            </div>
            <p className="text-[10px] text-zinc-600 font-medium">Использовано бюджета</p>
          </div>
        </motion.div>

        {/* Daily Budget - REAL DATA */}
        <motion.div 
          whileHover={{ scale: 1.03, y: -4 }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl glass-rich p-6 shadow-xl cursor-pointer relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-lg">
                <Calendar size={16} className="text-white" />
              </div>
              <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Дневной</p>
            </div>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-gradient-blue text-3xl font-bold tracking-tighter">{currencySign}{dailyBudget.toLocaleString("ru-RU")}</span>
            </div>
            <p className="text-[10px] text-zinc-600 font-medium">Рекомендуемый бюджет</p>
          </div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

"use client";

import { useAppStore } from "@/lib/app-store";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MoreHorizontal, Trash2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/cn";

export default function BudgetsPage() {
    const { transactions, currency, budgets, resetBudgets, clearBudgets, addBudget } = useAppStore();
    const [activeTab, setActiveTab] = useState<"income" | "expense">("expense");
    const [showOptions, setShowOptions] = useState(false);
    const [showAddBudget, setShowAddBudget] = useState(false);
    const [budgetName, setBudgetName] = useState("");
    const [budgetLimit, setBudgetLimit] = useState("");

    const currencySign = currency === "RUB" ? "₽" : currency;

    const totalIncome = transactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

    const displayTotal = activeTab === "income" ? totalIncome : totalExpense;

    // Use budgets from store for expenses, mock/calculate income sources if needed. 
    // For now, assuming "Budgets" in store map to "Expense Categories" for demonstration as per original design.
    // If activeTab is income, we might show income sources derived from transactions, or just a placeholder.

    // Let's derive income categories from transactions dynamically since we don't have income budgets usually.
    const incomeCategories = transactions
        .filter(t => t.type === "income")
        .reduce((acc, t) => {
            const existing = acc.find(c => c.title === t.title);
            if (existing) {
                existing.amount += t.amount;
            } else {
                acc.push({ title: t.title, amount: t.amount, color: "#22c55e" });
            }
            return acc;
        }, [] as { title: string, amount: number, color: string }[]);

    // Process budgets for display
    const expenseCategories = budgets.map((b, i) => ({
        title: b.name,
        amount: b.used,
        limit: b.limit,
        percent: Math.min(100, Math.round((b.used / b.limit) * 100)),
        color: ["#8b5cf6", "#06b6d4", "#f43f5e", "#eab308"][i % 4] // Cycle colors
    }));

    const categories = activeTab === "income" ? incomeCategories : expenseCategories;

    const maxVal = activeTab === "income"
        ? Math.max(...incomeCategories.map(c => c.amount), 1)
        : Math.max(...expenseCategories.map(c => c.limit || c.amount), 1);

    const handleAddBudget = () => {
        if (!budgetName.trim() || !budgetLimit || Number(budgetLimit) <= 0) return;
        
        addBudget({
            name: budgetName.trim(),
            used: 0,
            limit: Number(budgetLimit),
        });
        
        setBudgetName("");
        setBudgetLimit("");
        setShowAddBudget(false);
    };

    return (
        <section className="space-y-6 pt-2">
            {/* Header */}
            <header className="flex items-center justify-between mb-8 relative z-50">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.history.back()}
                    className="h-11 w-11 flex items-center justify-center rounded-xl glass-panel text-zinc-400 hover:text-white transition-colors cursor-pointer shadow-lg"
                    aria-label="Назад"
                >
                    <ArrowLeft size={20} />
                </motion.button>

                {/* Segmented Control */}
                <div className="flex glass-panel p-1 rounded-full">
                    <button
                        onClick={() => setActiveTab("income")}
                        className={cn(
                            "px-6 py-2 text-sm font-medium rounded-full transition-all duration-300",
                            activeTab === "income" ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg glow-green" : "text-zinc-500 hover:text-zinc-300"
                        )}
                    >
                        Доходы
                    </button>
                    <button
                        onClick={() => setActiveTab("expense")}
                        className={cn(
                            "px-6 py-2 text-sm font-medium rounded-full transition-all duration-300",
                            activeTab === "expense" ? "bg-gradient-to-r from-violet-500 to-violet-600 text-white shadow-lg glow-purple" : "text-zinc-500 hover:text-zinc-300"
                        )}
                    >
                        Расходы
                    </button>
                </div>

                <div className="relative">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowOptions(!showOptions)}
                        className="h-11 w-11 flex items-center justify-center rounded-xl glass-panel text-zinc-400 hover:text-white transition-colors shadow-lg"
                    >
                        <MoreHorizontal size={20} />
                    </motion.button>

                    <AnimatePresence>
                        {showOptions && activeTab === "expense" && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="absolute right-0 top-full mt-2 w-48 glass-rich rounded-xl shadow-xl overflow-hidden z-50 p-1"
                            >
                                <button
                                    onClick={() => { resetBudgets(); setShowOptions(false); }}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 rounded-lg transition-colors"
                                >
                                    <RefreshCw size={16} /> Сбросить траты
                                </button>
                                <button
                                    onClick={() => { clearBudgets(); setShowOptions(false); }}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                                >
                                    <Trash2 size={16} /> Удалить все
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </header>

            {/* Total Display */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-2 py-4"
            >
                <p className="text-zinc-500 text-sm uppercase tracking-wider font-semibold">Всего {activeTab === "income" ? "доходов" : "расходов"}</p>
                <h1 className="text-5xl font-bold text-gradient tracking-tighter">
                    {currencySign}{displayTotal.toLocaleString("ru-RU").replace(",", " ")}
                </h1>
                <button className="text-xs text-zinc-600 flex items-center justify-center gap-1 mx-auto mt-2 hover:text-zinc-400 font-medium">
                    Месяц ⌄
                </button>
            </motion.div>

            {/* Minimal Chart Area (Dynamic) */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="h-40 flex items-end justify-between px-6 pb-2 relative glass-panel rounded-3xl"
            >
                {/* Chart Grid Lines */}
                <div className="absolute inset-x-6 top-0 bottom-6 flex flex-col justify-between opacity-10 pointer-events-none">
                    <div className="h-px bg-zinc-500 w-full" />
                    <div className="h-px bg-zinc-500 w-full" />
                    <div className="h-px bg-zinc-500 w-full" />
                </div>

                {/* Just lines or subtle bars */}
                {[1, 2, 3, 4].map((w) => (
                    <div key={w} className="flex flex-col items-center gap-2 w-1/4 z-10">
                        <motion.div
                            initial={{ height: "0%" }}
                            animate={{ height: `${Math.random() * 60 + 20}%` }}
                            transition={{ duration: 1, delay: w * 0.1 }}
                            className="w-[2px] bg-gradient-to-t from-emerald-500/50 to-transparent shadow-lg"
                        />
                        <span className="text-[10px] text-zinc-700 font-medium tracking-wider">нед {w}</span>
                    </div>
                ))}
            </motion.div>

            {/* Breakdown List */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
            >
                <div className="flex items-center justify-between">
                    <h3 className="text-zinc-500 text-sm font-medium uppercase tracking-wider">
                        {activeTab === "income" ? "Источники доходов" : "Категории расходов"}
                    </h3>
                    {activeTab === "expense" && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowAddBudget(!showAddBudget)}
                            className="text-xs text-emerald-500 hover:text-emerald-400 font-medium flex items-center gap-1 cursor-pointer"
                        >
                            {showAddBudget ? "Отмена" : "+ Добавить"}
                        </motion.button>
                    )}
                </div>

                {/* Add Budget Form */}
                <AnimatePresence>
                    {showAddBudget && activeTab === "expense" && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden glass-rich rounded-3xl p-5 space-y-4 shadow-xl"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-60" />
                            <div className="relative z-10">
                                <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                                    Новый бюджет
                                </h4>
                                <div className="space-y-3 mt-4">
                                    <input
                                        value={budgetName}
                                        onChange={(e) => setBudgetName(e.target.value)}
                                        placeholder="Название (Продукты, Транспорт...)"
                                        className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500 outline-none placeholder:text-zinc-600 transition-colors"
                                    />
                                    <div className="flex gap-2">
                                        <input
                                            value={budgetLimit}
                                            onChange={(e) => setBudgetLimit(e.target.value)}
                                            type="number"
                                            placeholder="Лимит"
                                            className="flex-1 bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500 outline-none placeholder:text-zinc-600 transition-colors"
                                        />
                                        <button
                                            onClick={handleAddBudget}
                                            className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 rounded-xl font-bold hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/20 transition-all"
                                        >
                                            OK
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="space-y-3 pb-24">
                    {categories.map((item, i) => {
                        const percent = activeTab === "income"
                            ? Math.round((item.amount / maxVal) * 100)
                            : (item as any).percent;

                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ scale: 1.02, y: -2 }}
                                className="glass-rich p-5 rounded-[2rem] flex items-center justify-between cursor-pointer transition-all shadow-lg"
                            >
                                <div>
                                    <p className="text-zinc-500 text-sm mb-1 font-medium">{item.title}</p>
                                    <p className="text-white font-bold text-xl tracking-tight">{currencySign}{item.amount.toLocaleString("ru-RU")}</p>
                                </div>

                                {/* SVG Circular Progress */}
                                <div className="relative w-14 h-14 flex items-center justify-center">
                                    {/* Background Circle */}
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle
                                            cx="28"
                                            cy="28"
                                            r="22"
                                            stroke="#27272a"
                                            strokeWidth="4"
                                            fill="transparent"
                                        />
                                        <circle
                                            cx="28"
                                            cy="28"
                                            r="22"
                                            stroke={item.color}
                                            strokeWidth="4"
                                            fill="transparent"
                                            strokeDasharray={2 * Math.PI * 22}
                                            strokeDashoffset={2 * Math.PI * 22 * (1 - percent / 100)}
                                            strokeLinecap="round"
                                            className="drop-shadow-lg"
                                        />
                                    </svg>
                                    <span className="absolute text-[10px] font-bold text-black bg-current rounded-full w-8 h-8 flex items-center justify-center" style={{ backgroundColor: item.color }}>
                                        {Math.round(percent)}%
                                    </span>
                                </div>
                            </motion.div>
                        );
                    })}

                    {categories.length === 0 && (
                        <div className="text-center py-10 text-zinc-700">
                            Пусто
                        </div>
                    )}
                </div>
            </motion.div>
        </section>
    );
}

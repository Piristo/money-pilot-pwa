"use client";

import { useAppStore } from "@/lib/app-store";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, ShoppingBag, Coffee, Car, Home, X, ArrowLeft, MoreHorizontal, Trash2, Edit2, Check, Tag } from "lucide-react";
import { cn } from "@/lib/cn";
import { useTransactionGroups } from "@/lib/analytics";
import { autoDetectCategory, getCategoryName, getCategoryIcon, getCategoryColor } from "@/lib/categories/auto-detect";
import { CategoryPicker } from "@/components/CategoryPicker";

// Helper to map category/title to icon
const getIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("uber") || t.includes("taxi") || t.includes("auto") || t.includes("бензин")) return Car;
    if (t.includes("coffee") || t.includes("food") || t.includes("starbucks") || t.includes("супермаркет") || t.includes("продукты")) return ShoppingBag;
    if (t.includes("shop") || t.includes("h&m") || t.includes("zara")) return ShoppingBag;
    return Home;
};

const COLORS = [
    { name: "Red", value: "bg-rose-500" },
    { name: "Orange", value: "bg-orange-500" },
    { name: "Green", value: "bg-emerald-500" },
    { name: "Blue", value: "bg-blue-500" },
    { name: "Indigo", value: "bg-indigo-500" },
    { name: "Violet", value: "bg-violet-500" },
    { name: "Zinc", value: "bg-zinc-500" },
];

export default function TransactionsPage() {
    const {
        transactions, addTransaction, updateTransaction, deleteTransaction,
        subscriptions, addSubscription, deleteSubscription,
        budgets, updateBudget,
        currency
    } = useAppStore();
    
    // Use real transaction grouping
    const transactionGroups = useTransactionGroups();

    // Transactions State
    const [activeTab, setActiveTab] = useState<"income" | "expense">("expense");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [amount, setAmount] = useState("");
    const [title, setTitle] = useState("");
    const [type, setType] = useState<"income" | "expense">("expense");
    const [editId, setEditId] = useState<number | null>(null);
    const [selectedBudgetId, setSelectedBudgetId] = useState<number | null>(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(undefined);
    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | undefined>(undefined);
    const [showCategoryPicker, setShowCategoryPicker] = useState(false);

    // Auto-detect category when title changes
    useEffect(() => {
        if (title && !editId) {
            const detected = autoDetectCategory(title);
            if (detected) {
                setSelectedCategoryId(detected.categoryId);
                setSelectedSubcategoryId(detected.subcategoryId);
            }
        }
    }, [title, editId]);

    // Subscription State
    const [isSubFormOpen, setIsSubFormOpen] = useState(false);
    const [subName, setSubName] = useState("");
    const [subPrice, setSubPrice] = useState("");
    const [subColor, setSubColor] = useState(COLORS[0].value);

    const currencySign = currency === "RUB" ? "₽" : currency;

    // --- Transaction Handlers ---
    const resetForm = () => {
        setAmount("");
        setTitle("");
        setEditId(null);
        setType("expense");
        setSelectedBudgetId(null);
        setSelectedCategoryId(undefined);
        setSelectedSubcategoryId(undefined);
        setShowCategoryPicker(false);
        setIsFormOpen(false);
    };

    const handleSave = () => {
        if (!amount || !title) return;

        const txAmount = Number(amount);
        const txData = {
            amount: txAmount,
            type,
            title,
            date: editId ? (transactions.find(t => t.id === editId)?.date || "Сегодня") : new Date().toLocaleDateString("ru-RU", { day: "numeric", month: "long" }),
            budgetId: type === "expense" && selectedBudgetId ? selectedBudgetId : undefined,
            categoryId: selectedCategoryId,
            subcategoryId: selectedSubcategoryId
        };

        // If it's an expense and a budget is selected, update the budget
        if (type === "expense" && selectedBudgetId) {
            const budget = budgets.find(b => b.id === selectedBudgetId);
            if (budget) {
                // If editing, subtract old amount first
                let oldAmount = 0;
                if (editId) {
                    const oldTx = transactions.find(t => t.id === editId);
                    if (oldTx && oldTx.type === "expense" && oldTx.budgetId === selectedBudgetId) {
                        oldAmount = oldTx.amount;
                    }
                }
                
                const newUsed = Math.max(0, budget.used - oldAmount + txAmount);
                updateBudget(selectedBudgetId, {
                    name: budget.name,
                    used: newUsed,
                    limit: budget.limit
                });
            }
        }

        if (editId) {
            updateTransaction(editId, txData);
        } else {
            addTransaction(txData);
        }
        resetForm();
    };

    const handleEdit = (t: typeof transactions[0]) => {
        setEditId(t.id);
        setTitle(t.title);
        setAmount(String(t.amount));
        setType(t.type);
        setSelectedBudgetId(t.budgetId || null);
        setSelectedCategoryId(t.categoryId);
        setSelectedSubcategoryId(t.subcategoryId);
        setIsFormOpen(true);
    };

    const handleDelete = () => {
        if (editId) {
            // Если транзакция связана с бюджетом, вычитаем сумму
            const transaction = transactions.find(t => t.id === editId);
            if (transaction && transaction.type === "expense" && transaction.budgetId) {
                const budget = budgets.find(b => b.id === transaction.budgetId);
                if (budget) {
                    const newUsed = Math.max(0, budget.used - transaction.amount);
                    updateBudget(transaction.budgetId, {
                        name: budget.name,
                        used: newUsed,
                        limit: budget.limit
                    });
                }
            }
            
            deleteTransaction(editId);
            resetForm();
        }
    };

    // --- Subscription Handlers ---
    const handleAddSub = () => {
        if (!subName || !subPrice) return;
        addSubscription({
            name: subName,
            price: Number(subPrice),
            color: subColor
        });
        setSubName("");
        setSubPrice("");
        setSubColor(COLORS[0].value);
        setIsSubFormOpen(false);
    };


    return (
        <section className="space-y-6 pt-2">
            {/* Header */}
            <header className="flex items-center justify-between mb-8">
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
                            activeTab === "expense" ? "bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"
                        )}
                    >
                        Расходы
                    </button>
                </div>

                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="h-11 w-11 flex items-center justify-center rounded-xl glass-panel text-zinc-400 hover:text-white transition-colors cursor-pointer shadow-lg" 
                    aria-label="Дополнительные опции"
                >
                    <MoreHorizontal size={20} />
                </motion.button>
            </header>

            {/* Monthly Charges - Scrollable & Dynamic */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
            >
                <div className="flex items-center justify-between">
                    <h3 className="text-zinc-400 text-sm font-semibold uppercase tracking-wider">Ежемесячные платежи</h3>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsSubFormOpen(true)}
                        className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1.5 transition-colors"
                    >
                        <Plus size={14} /> Добавить
                    </motion.button>
                </div>

                <AnimatePresence>
                    {isSubFormOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="glass-rich rounded-3xl p-5 mb-4 overflow-hidden relative shadow-xl"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-60" />
                            <div className="relative z-10">
                                <h4 className="text-xs text-zinc-500 mb-4 font-semibold uppercase tracking-wider">Новая подписка</h4>
                                <div className="space-y-3">
                                    <input
                                        value={subName}
                                        onChange={(e) => setSubName(e.target.value)}
                                        placeholder="Название (Netflix...)"
                                        className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                                    />
                                    <div className="flex gap-2">
                                        <input
                                            value={subPrice}
                                            onChange={(e) => setSubPrice(e.target.value)}
                                            type="number"
                                            placeholder="Цена"
                                            className="w-1/2 bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                                        />
                                        <div className="flex-1 flex gap-1.5 items-center overflow-x-auto no-scrollbar">
                                            {COLORS.map(c => (
                                                <button
                                                    key={c.name}
                                                    onClick={() => setSubColor(c.value)}
                                                    className={cn(
                                                        "w-9 h-9 rounded-full shrink-0 flex items-center justify-center transition-all",
                                                        c.value,
                                                        subColor === c.value ? "scale-110 ring-2 ring-white shadow-lg" : "opacity-70 hover:opacity-100 hover:scale-105"
                                                    )}
                                                >
                                                    {subColor === c.value && <Check size={16} className="text-white drop-shadow" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <button onClick={() => setIsSubFormOpen(false)} className="flex-1 py-2.5 rounded-xl text-zinc-400 hover:bg-zinc-800 text-sm font-medium transition-colors">Отмена</button>
                                        <button onClick={handleAddSub} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-sm hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/20 transition-all">Добавить</button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-5 px-5 snap-x snap-mandatory">
                    {/* Empty State or Add First */}
                    {subscriptions.length === 0 && !isSubFormOpen && (
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setIsSubFormOpen(true)}
                            className="snap-start min-w-[140px] border-2 border-dashed border-zinc-700 p-4 rounded-3xl flex items-center justify-center gap-2 glass-panel shrink-0 cursor-pointer hover:border-emerald-500/50 hover:bg-zinc-900/50 transition-all group"
                        >
                            <Plus size={20} className="text-zinc-600 group-hover:text-emerald-500 transition-colors" />
                            <span className="text-sm text-zinc-600 group-hover:text-emerald-500 font-medium transition-colors">Добавить</span>
                        </motion.div>
                    )}

                    {subscriptions.map((sub, idx) => (
                        <motion.div 
                            key={sub.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            whileHover={{ scale: 1.05, y: -2 }}
                            className="snap-start min-w-[140px] glass-rich p-4 rounded-3xl flex items-center gap-3 shrink-0 relative group shadow-lg"
                        >
                            <button
                                onClick={() => deleteSubscription(sub.id)}
                                className="absolute top-2 right-2 p-1.5 text-zinc-600 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all bg-zinc-950/80 rounded-full"
                            >
                                <X size={12} />
                            </button>
                            <div className={cn("w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-lg capitalize", sub.color)}>
                                {sub.name[0]}
                            </div>
                            <div>
                                <p className="font-semibold text-white text-sm truncate max-w-[70px]">{sub.name}</p>
                                <p className="text-xs text-zinc-500 mt-0.5 font-medium">{currencySign}{sub.price}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Transactions List */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4 pb-24"
            >
                <div className="flex items-center justify-between">
                    <h3 className="text-zinc-400 text-sm font-semibold uppercase tracking-wider">Все транзакции</h3>
                    <button className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">Месяц ⌄</button>
                </div>

                {/* Add Button */}
                <motion.button
                    whileHover={{ scale: 1.01, y: -2 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => { resetForm(); setIsFormOpen(true); }}
                    className="w-full py-4 rounded-3xl border-2 border-dashed border-zinc-800 text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/50 glass-panel transition-all flex items-center justify-center gap-2 mb-6 group"
                >
                    <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" /> 
                    <span className="font-semibold">Добавить операцию</span>
                </motion.button>

                <AnimatePresence>
                    {isFormOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden glass-rich rounded-3xl p-5 space-y-4 mb-6 relative shadow-xl"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-60" />
                            <div className="relative z-10">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                                        {editId ? "Редактирование" : "Новая запись"}
                                    </h4>
                                    {editId && (
                                        <button onClick={handleDelete} className="text-rose-500 p-2 hover:bg-rose-500/10 rounded-full transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <button onClick={() => setType("expense")} className={cn("flex-1 py-2 text-xs font-medium rounded-xl border transition-colors", type === "expense" ? "bg-rose-500/10 border-rose-500 text-rose-500" : "border-zinc-800 text-zinc-500")}>Расход</button>
                                    <button onClick={() => setType("income")} className={cn("flex-1 py-2 text-xs font-medium rounded-xl border transition-colors", type === "income" ? "bg-emerald-500/10 border-emerald-500 text-emerald-500" : "border-zinc-800 text-zinc-500")}>Доход</button>
                                </div>

                                <div className="space-y-2">
                                    <input
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Название..."
                                        className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500 outline-none placeholder:text-zinc-600 transition-colors"
                                    />
                                    
                                    {/* Category Selector */}
                                    <button
                                        type="button"
                                        onClick={() => setShowCategoryPicker(!showCategoryPicker)}
                                        className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-left flex items-center justify-between hover:border-emerald-500 transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            {selectedCategoryId ? (
                                                <>
                                                    {(() => {
                                                        const Icon = getCategoryIcon(selectedCategoryId);
                                                        const color = getCategoryColor(selectedCategoryId);
                                                        return Icon ? (
                                                            <div
                                                                className="h-6 w-6 rounded-lg flex items-center justify-center"
                                                                style={{ backgroundColor: `${color}20` }}
                                                            >
                                                                <Icon size={14} style={{ color }} />
                                                            </div>
                                                        ) : null;
                                                    })()}
                                                    <span className="text-white">
                                                        {getCategoryName(selectedCategoryId, selectedSubcategoryId)}
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <Tag size={16} className="text-zinc-600" />
                                                    <span className="text-zinc-600">Выбрать категорию</span>
                                                </>
                                            )}
                                        </div>
                                        <motion.div
                                            animate={{ rotate: showCategoryPicker ? 180 : 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </motion.div>
                                    </button>

                                    {/* Category Picker Dropdown */}
                                    <AnimatePresence>
                                        {showCategoryPicker && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="max-h-64 overflow-y-auto custom-scrollbar bg-black/50 border border-zinc-800 rounded-xl p-3">
                                                    <CategoryPicker
                                                        selectedCategoryId={selectedCategoryId}
                                                        selectedSubcategoryId={selectedSubcategoryId}
                                                        onSelect={(categoryId, subcategoryId) => {
                                                            setSelectedCategoryId(categoryId);
                                                            setSelectedSubcategoryId(subcategoryId);
                                                            setShowCategoryPicker(false);
                                                        }}
                                                    />
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                    
                                    {/* Budget Category Selector - Only for expenses */}
                                    {type === "expense" && budgets.length > 0 && (
                                        <select
                                            value={selectedBudgetId || ""}
                                            onChange={(e) => setSelectedBudgetId(e.target.value ? Number(e.target.value) : null)}
                                            className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500 outline-none transition-colors"
                                        >
                                            <option value="">Без бюджета</option>
                                            {budgets.map(b => (
                                                <option key={b.id} value={b.id}>{b.name}</option>
                                            ))}
                                        </select>
                                    )}
                                    
                                    <div className="flex gap-2">
                                        <input
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            type="number"
                                            placeholder="Сумма"
                                            className="flex-1 bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500 outline-none placeholder:text-zinc-600 transition-colors"
                                        />
                                        <button
                                            onClick={handleSave}
                                            className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 rounded-xl font-bold hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/20 transition-all"
                                        >
                                            OK
                                        </button>
                                    </div>
                                </div>

                                <button onClick={resetForm} className="absolute top-4 right-4 text-zinc-500 hover:text-white">
                                    <X size={20} />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="space-y-6">
                    {/* Grouped by date - REAL DATA */}
                    {transactionGroups.map((group) => (
                        <div key={group.date} className="space-y-4">
                            <p className="text-xs text-zinc-600 font-medium uppercase tracking-wider">{group.displayDate}</p>
                            
                            {group.transactions.map((t) => {
                                const Icon = t.categoryId ? getCategoryIcon(t.categoryId) : getIcon(t.title);
                                const categoryColor = t.categoryId ? getCategoryColor(t.categoryId) : undefined;
                                const isExpense = t.type === "expense";
                                const budget = t.budgetId ? budgets.find(b => b.id === t.budgetId) : null;
                                const categoryName = t.categoryId ? getCategoryName(t.categoryId, t.subcategoryId) : null;

                                return (
                                    <motion.div
                                        key={t.id}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        whileHover={{ scale: 1.01, x: 4 }}
                                        onClick={() => handleEdit(t)}
                                        className="flex items-center justify-between group py-3 px-4 -mx-4 cursor-pointer glass-panel rounded-2xl active:scale-[0.99] transition-all shadow-lg"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div 
                                                className="h-12 w-12 rounded-2xl border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:border-zinc-700 group-hover:shadow-lg transition-all"
                                                style={categoryColor ? {
                                                    background: `linear-gradient(135deg, ${categoryColor}20 0%, ${categoryColor}10 100%)`,
                                                    borderColor: `${categoryColor}40`
                                                } : {
                                                    background: 'linear-gradient(to bottom right, rgb(24, 24, 27), rgb(39, 39, 42))'
                                                }}
                                            >
                                                {Icon && <Icon size={20} style={categoryColor ? { color: categoryColor } : undefined} />}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-bold text-white text-[15px]">{t.title}</p>
                                                    <Edit2 size={12} className="opacity-0 group-hover:opacity-100 text-zinc-600 transition-opacity" />
                                                </div>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    {categoryName && (
                                                        <>
                                                            <span className="text-xs font-medium" style={{ color: categoryColor }}>
                                                                {categoryName}
                                                            </span>
                                                            {budget && <span className="text-zinc-700">•</span>}
                                                        </>
                                                    )}
                                                    {budget && (
                                                        <span className="text-xs text-emerald-500/70 font-medium">{budget.name}</span>
                                                    )}
                                                    {!categoryName && !budget && (
                                                        <p className="text-xs text-zinc-600 font-medium">{isExpense ? "Расходы" : "Доходы"}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={cn("font-bold text-base tracking-tight block", isExpense ? "text-white" : "text-gradient")}>
                                                {isExpense ? "-" : "+"}{currencySign}{t.amount.toLocaleString("ru-RU").replace(",", " ")}
                                            </span>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    ))}
                </div>
                {transactions.length === 0 && (
                    <div className="text-center py-10 text-muted-foreground">
                        <p>Нет операций</p>
                    </div>
                )}
            </motion.div>
        </section>
    );
}

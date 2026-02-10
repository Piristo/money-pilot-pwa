"use client";

import { useAppStore } from "@/lib/app-store";
import { CreditCard, Globe, Languages, Bell, User, ChevronRight, Check, Car } from "lucide-react";
import { cn } from "@/lib/cn";
import { motion } from "framer-motion";

export default function ProfilePage() {
    const {
        plan,
        setPlan,
        currency,
        setCurrency,
        locale,
        setLocale,
        notificationsEnabled,
        setNotificationsEnabled,
        carName,
        setCarName,
    } = useAppStore();

    return (
        <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            <motion.header 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4"
            >
                <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-xl glow-green flex items-center justify-center text-white text-2xl font-bold"
                >
                    Н
                </motion.div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gradient">Николай</h1>
                    <p className="text-sm text-zinc-500 font-medium">{plan === "pro" ? "Pro Member" : "Free Member"}</p>
                </div>
            </motion.header>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="rounded-3xl glass-rich p-6 text-white shadow-xl relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-indigo-600/20" />
                <div className="absolute right-0 top-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10 blur-xl" />
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <p className="font-medium text-zinc-400 mb-1 uppercase tracking-wider text-sm">Ваш план</p>
                        <h2 className="text-3xl font-bold text-gradient-purple">{plan.toUpperCase()}</h2>
                    </div>
                    {plan === "free" ? (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setPlan("pro")}
                            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-indigo-600 shadow-lg"
                        >
                            Upgrade
                        </motion.button>
                    ) : (
                        <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-xs font-medium backdrop-blur-md border border-white/10">
                            <Check size={14} /> Активен
                        </div>
                    )}
                </div>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-4"
            >
                <h3 className="px-1 text-sm font-medium text-zinc-500 uppercase tracking-wider">Настройки</h3>

                <div className="glass-rich rounded-2xl overflow-hidden divide-y divide-white/5 shadow-xl">
                    <motion.div 
                        whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                        className="flex items-center justify-between p-4 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                                <CreditCard size={20} />
                            </div>
                            <span className="font-medium text-white">Валюта</span>
                        </div>
                        <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="bg-transparent text-sm font-medium outline-none text-right cursor-pointer text-zinc-400 focus:text-emerald-500 transition-colors"
                        >
                            <option value="RUB" className="bg-background">RUB (₽)</option>
                            <option value="USD" className="bg-background">USD ($)</option>
                            <option value="EUR" className="bg-background">EUR (€)</option>
                        </select>
                    </motion.div>

                    <motion.div 
                        whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                        className="flex items-center justify-between p-4 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                                <Globe size={20} />
                            </div>
                            <span className="font-medium text-white">Язык</span>
                        </div>
                        <select
                            value={locale}
                            onChange={(e) => setLocale(e.target.value)}
                            className="bg-transparent text-sm font-medium outline-none text-right cursor-pointer text-zinc-400 focus:text-blue-500 transition-colors"
                        >
                            <option value="ru-RU" className="bg-background">Русский</option>
                            <option value="en-US" className="bg-background">English</option>
                        </select>
                    </motion.div>

                    <motion.label 
                        whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                        className="flex items-center justify-between p-4 transition-colors cursor-pointer"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                                <Bell size={20} />
                            </div>
                            <span className="font-medium text-white">Уведомления</span>
                        </div>
                        <div className={cn(
                            "w-11 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out relative",
                            notificationsEnabled ? "bg-emerald-500" : "bg-zinc-700"
                        )}>
                            <input
                                type="checkbox"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                checked={notificationsEnabled}
                                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                            />
                            <div className={cn(
                                "bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out",
                                notificationsEnabled ? "translate-x-5" : "translate-x-0"
                            )} />
                        </div>
                    </motion.label>

                    <motion.div 
                        whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                        className="flex items-center justify-between p-4 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500">
                                <Car size={20} />
                            </div>
                            <span className="font-medium text-white">Автомобиль</span>
                        </div>
                        <input
                            value={carName}
                            onChange={(e) => setCarName(e.target.value)}
                            className="bg-transparent text-sm font-medium outline-none text-right cursor-text text-zinc-400 focus:text-white transition-colors border-b border-transparent focus:border-zinc-700 pb-0.5"
                        />
                    </motion.div>
                </div>

                <div className="flex flex-col gap-3 pt-4">
                    <button 
                        onClick={() => {
                            if (confirm('Вы уверены? Все данные будут удалены безвозвратно.')) {
                                localStorage.removeItem('money-pilot-store-v1');
                                window.location.reload();
                            }
                        }}
                        className="text-sm text-amber-500 hover:text-amber-400 font-medium transition-colors"
                    >
                        🗑️ Очистить все данные
                    </button>
                    <button className="text-sm text-destructive hover:underline opacity-80">Выйти из аккаунта</button>
                </div>
            </motion.div>
        </motion.section>
    );
}

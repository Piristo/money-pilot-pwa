"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { CarProfile, FuelLog, MaintenanceLog, Reminder as AutoReminder } from './auto/types';

export type TxType = "income" | "expense";
export type PlanType = "free" | "pro";

export type Transaction = {
    id: number;
    title: string;
    amount: number;
    type: TxType;
    date: string;
    budgetId?: number; // Связь с бюджетом (для расходов)
    categoryId?: string; // ID категории
    subcategoryId?: string; // ID подкатегории
};

export type Budget = {
    id: number;
    name: string;
    used: number;
    limit: number;
};

export type AutoExpense = {
    id: number;
    title: string;
    amount: number;
    date: string;
};

export type Reminder = {
    id: number;
    title: string;
    due: string;
};

export type Subscription = {
    id: number;
    name: string;
    price: number;
    color: string;
};

type StoreState = {
    transactions: Transaction[];
    budgets: Budget[];
    autoExpenses: AutoExpense[];
    reminders: Reminder[];
    subscriptions: Subscription[];
    plan: PlanType;
    carName: string;
    currency: string;
    locale: string;
    notificationsEnabled: boolean;
    
    // Auto module fields
    carProfile: CarProfile | null;
    fuelLogs: FuelLog[];
    maintenanceLogs: MaintenanceLog[];
    autoReminders: AutoReminder[];
};

type StoreContextType = StoreState & {
    addTransaction: (tx: Omit<Transaction, "id">) => void;
    updateTransaction: (id: number, tx: Omit<Transaction, "id">) => void;
    deleteTransaction: (id: number) => void;

    addBudget: (budget: Omit<Budget, "id">) => void;
    updateBudget: (id: number, budget: Omit<Budget, "id">) => void;
    deleteBudget: (id: number) => void;
    resetBudgets: () => void;
    clearBudgets: () => void;

    addAutoExpense: (expense: Omit<AutoExpense, "id">) => void;
    deleteAutoExpense: (id: number) => void;

    addReminder: (reminder: Omit<Reminder, "id">) => void;
    deleteReminder: (id: number) => void;

    addSubscription: (sub: Omit<Subscription, "id">) => void;
    deleteSubscription: (id: number) => void;

    setPlan: (plan: PlanType) => void;
    setCarName: (carName: string) => void;
    setCurrency: (currency: string) => void;
    setLocale: (locale: string) => void;
    setNotificationsEnabled: (enabled: boolean) => void;
    
    // Car profile actions
    setCarProfile: (profile: CarProfile) => void;
    updateCarMileage: (mileage: number) => void;
    updateFuelPrice: (price: number) => void;
    
    // Fuel log actions
    addFuelLog: (log: Omit<FuelLog, 'id' | 'pricePerLiter'>) => void;
    updateFuelLog: (id: number, log: Omit<FuelLog, 'id' | 'pricePerLiter'>) => void;
    deleteFuelLog: (id: number) => void;
    
    // Maintenance log actions
    addMaintenanceLog: (log: Omit<MaintenanceLog, 'id'>) => void;
    updateMaintenanceLog: (id: number, log: Omit<MaintenanceLog, 'id'>) => void;
    deleteMaintenanceLog: (id: number) => void;
    
    // Auto reminder actions
    addAutoReminder: (reminder: Omit<AutoReminder, 'id' | 'createdAt'>) => void;
    updateAutoReminder: (id: number, reminder: Partial<AutoReminder>) => void;
    deleteAutoReminder: (id: number) => void;
    completeAutoReminder: (id: number) => void;
};

const initialState: StoreState = {
    transactions: [],
    budgets: [],
    autoExpenses: [],
    reminders: [],
    subscriptions: [],
    plan: "free",
    carName: "Мой автомобиль",
    currency: "RUB",
    locale: "ru-RU",
    notificationsEnabled: true,
    
    // Auto module initial state
    carProfile: null,
    fuelLogs: [],
    maintenanceLogs: [],
    autoReminders: [],
};

const STORAGE_KEY = "money-pilot-store-v2";

const AppStoreContext = createContext<StoreContextType | null>(null);

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<StoreState>(initialState);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) {
            // Try loading from v1 for migration
            const oldSaved = localStorage.getItem("money-pilot-store-v1");
            if (oldSaved) {
                try {
                    const parsed = JSON.parse(oldSaved);
                    // Migrate from v1 to v2
                    setState({
                        ...parsed,
                        carProfile: null,
                        fuelLogs: [],
                        maintenanceLogs: [],
                        autoReminders: [],
                    });
                    return;
                } catch {
                    // ignore corrupted storage
                }
            }
            return;
        }
        try {
            const parsed = JSON.parse(saved) as StoreState;
            // Ensure new fields exist for backward compatibility
            if (!parsed.carProfile) parsed.carProfile = null;
            if (!parsed.fuelLogs) parsed.fuelLogs = [];
            if (!parsed.maintenanceLogs) parsed.maintenanceLogs = [];
            if (!parsed.autoReminders) parsed.autoReminders = [];
            if (!parsed.subscriptions) parsed.subscriptions = [];
            setState(parsed);
        } catch {
            // ignore corrupted storage
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, [state]);

    const value = useMemo<StoreContextType>(
        () => ({
            ...state,
            addTransaction: (tx) =>
                setState((prev) => ({ ...prev, transactions: [{ id: Date.now(), ...tx }, ...prev.transactions] })),
            updateTransaction: (id, tx) =>
                setState((prev) => ({
                    ...prev,
                    transactions: prev.transactions.map((t) => (t.id === id ? { id, ...tx } : t)),
                })),
            deleteTransaction: (id) =>
                setState((prev) => ({ ...prev, transactions: prev.transactions.filter((t) => t.id !== id) })),

            addBudget: (budget) =>
                setState((prev) => ({ ...prev, budgets: [{ id: Date.now(), ...budget }, ...prev.budgets] })),
            updateBudget: (id, budget) =>
                setState((prev) => ({
                    ...prev,
                    budgets: prev.budgets.map((b) => (b.id === id ? { id, ...budget } : b)),
                })),
            deleteBudget: (id) =>
                setState((prev) => ({ ...prev, budgets: prev.budgets.filter((b) => b.id !== id) })),

            addAutoExpense: (expense) =>
                setState((prev) => ({ ...prev, autoExpenses: [{ id: Date.now(), ...expense }, ...prev.autoExpenses] })),
            deleteAutoExpense: (id) =>
                setState((prev) => ({ ...prev, autoExpenses: prev.autoExpenses.filter((e) => e.id !== id) })),

            addReminder: (reminder) =>
                setState((prev) => ({ ...prev, reminders: [{ id: Date.now(), ...reminder }, ...prev.reminders] })),
            deleteReminder: (id) =>
                setState((prev) => ({ ...prev, reminders: prev.reminders.filter((r) => r.id !== id) })),

            addSubscription: (sub) =>
                setState((prev) => ({ ...prev, subscriptions: [{ id: Date.now(), ...sub }, ...prev.subscriptions] })),
            deleteSubscription: (id) =>
                setState((prev) => ({ ...prev, subscriptions: prev.subscriptions.filter((s) => s.id !== id) })),

            setPlan: (plan) => setState((prev) => ({ ...prev, plan })),
            setCurrency: (currency) => setState((prev) => ({ ...prev, currency })),
            setLocale: (locale) => setState((prev) => ({ ...prev, locale })),
            setNotificationsEnabled: (notificationsEnabled) =>
                setState((prev) => ({ ...prev, notificationsEnabled })),
            setCarName: (carName) => setState((prev) => ({ ...prev, carName })),
            resetBudgets: () => setState((prev) => ({ ...prev, budgets: prev.budgets.map(b => ({ ...b, used: 0 })) })),
            clearBudgets: () => setState((prev) => ({ ...prev, budgets: [] })),
            
            // Car profile actions
            setCarProfile: (profile) => setState((prev) => ({ ...prev, carProfile: profile })),
            updateCarMileage: (mileage) => setState((prev) => ({
                ...prev,
                carProfile: prev.carProfile ? { ...prev.carProfile, mileage } : null
            })),
            updateFuelPrice: (fuelPrice) => setState((prev) => ({
                ...prev,
                carProfile: prev.carProfile ? { ...prev.carProfile, fuelPrice } : null
            })),
            
            // Fuel log actions
            addFuelLog: (log) => {
                const pricePerLiter = log.amount / log.liters;
                setState((prev) => ({
                    ...prev,
                    fuelLogs: [{ id: Date.now(), ...log, pricePerLiter }, ...prev.fuelLogs]
                }));
            },
            updateFuelLog: (id, log) => {
                const pricePerLiter = log.amount / log.liters;
                setState((prev) => ({
                    ...prev,
                    fuelLogs: prev.fuelLogs.map((l) => 
                        l.id === id ? { id, ...log, pricePerLiter } : l
                    )
                }));
            },
            deleteFuelLog: (id) => setState((prev) => ({
                ...prev,
                fuelLogs: prev.fuelLogs.filter((l) => l.id !== id)
            })),
            
            // Maintenance log actions
            addMaintenanceLog: (log) => setState((prev) => ({
                ...prev,
                maintenanceLogs: [{ id: Date.now(), ...log }, ...prev.maintenanceLogs]
            })),
            updateMaintenanceLog: (id, log) => setState((prev) => ({
                ...prev,
                maintenanceLogs: prev.maintenanceLogs.map((l) => 
                    l.id === id ? { id, ...log } : l
                )
            })),
            deleteMaintenanceLog: (id) => setState((prev) => ({
                ...prev,
                maintenanceLogs: prev.maintenanceLogs.filter((l) => l.id !== id)
            })),
            
            // Auto reminder actions
            addAutoReminder: (reminder) => setState((prev) => ({
                ...prev,
                autoReminders: [{
                    id: Date.now(),
                    ...reminder,
                    createdAt: new Date().toISOString()
                }, ...prev.autoReminders]
            })),
            updateAutoReminder: (id, reminder) => setState((prev) => ({
                ...prev,
                autoReminders: prev.autoReminders.map((r) => 
                    r.id === id ? { ...r, ...reminder } : r
                )
            })),
            deleteAutoReminder: (id) => setState((prev) => ({
                ...prev,
                autoReminders: prev.autoReminders.filter((r) => r.id !== id)
            })),
            completeAutoReminder: (id) => setState((prev) => ({
                ...prev,
                autoReminders: prev.autoReminders.map((r) => 
                    r.id === id ? { ...r, completed: true } : r
                )
            })),
        }),
        [state],
    );

    return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

export function useAppStore() {
    const context = useContext(AppStoreContext);
    if (!context) {
        throw new Error("useAppStore must be used inside AppStoreProvider");
    }
    return context;
}

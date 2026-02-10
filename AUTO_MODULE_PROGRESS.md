# Auto Module Upgrade - Progress Report

## Дата: 10.02.2026

## ✅ Завершено

### 1. Создана спецификация
- ✅ Requirements document (10 требований)
- ✅ Design document (архитектура, компоненты, 16 correctness properties)
- ✅ Tasks document (18 задач с подзадачами)

### 2. Созданы базовые типы и категории
- ✅ `src/lib/auto/types.ts` - все TypeScript типы
- ✅ `src/lib/auto/categories.ts` - категории расходов с иконками и цветами

## 🔄 В процессе

### 3. Обновление app-store
**Следующий шаг:** Расширить `src/lib/app-store.tsx` с новыми полями и действиями

**Что нужно добавить:**

#### Новые типы (импортировать из auto/types.ts):
```typescript
import { CarProfile, FuelLog, MaintenanceLog, Reminder as AutoReminder } from './auto/types';
```

#### Обновить StoreState:
```typescript
type StoreState = {
    // ... существующие поля
    
    // Новые поля для авто модуля
    carProfile: CarProfile | null;
    fuelLogs: FuelLog[];
    maintenanceLogs: MaintenanceLog[];
    autoReminders: AutoReminder[];
};
```

#### Обновить initialState:
```typescript
const initialState: StoreState = {
    // ... существующие поля
    
    carProfile: null,
    fuelLogs: [],
    maintenanceLogs: [],
    autoReminders: [],
};
```

#### Изменить STORAGE_KEY:
```typescript
const STORAGE_KEY = "money-pilot-store-v2"; // было v1
```

#### Добавить миграцию в useEffect:
```typescript
useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
        // Try loading from v1
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
                // ignore
            }
        }
        return;
    }
    try {
        const parsed = JSON.parse(saved) as StoreState;
        // Ensure new fields exist
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
```

#### Добавить новые действия в StoreContextType:
```typescript
type StoreContextType = StoreState & {
    // ... существующие действия
    
    // Car profile
    setCarProfile: (profile: CarProfile) => void;
    updateCarMileage: (mileage: number) => void;
    updateFuelPrice: (price: number) => void;
    
    // Fuel logs
    addFuelLog: (log: Omit<FuelLog, 'id' | 'pricePerLiter'>) => void;
    updateFuelLog: (id: number, log: Omit<FuelLog, 'id' | 'pricePerLiter'>) => void;
    deleteFuelLog: (id: number) => void;
    
    // Maintenance logs
    addMaintenanceLog: (log: Omit<MaintenanceLog, 'id'>) => void;
    updateMaintenanceLog: (id: number, log: Omit<MaintenanceLog, 'id'>) => void;
    deleteMaintenanceLog: (id: number) => void;
    
    // Auto reminders
    addAutoReminder: (reminder: Omit<AutoReminder, 'id' | 'createdAt'>) => void;
    updateAutoReminder: (id: number, reminder: Partial<AutoReminder>) => void;
    deleteAutoReminder: (id: number) => void;
    completeAutoReminder: (id: number) => void;
};
```

#### Реализовать действия в useMemo:
```typescript
const value = useMemo<StoreContextType>(
    () => ({
        ...state,
        // ... существующие действия
        
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
```

## 📋 Следующие задачи

После обновления store:

1. **Создать калькуляторы** (2-3 часа)
   - `src/lib/auto/fuel-calculator.ts` - расчёт реального расхода
   - `src/lib/auto/metrics.ts` - расчёт метрик (₽/км, прогнозы)
   - `src/lib/auto/reminders.ts` - логика напоминаний

2. **Создать UI компоненты** (2-3 часа)
   - `src/components/auto/MetricsCard.tsx`
   - `src/components/auto/FuelChart.tsx`
   - `src/components/auto/ExpenseCategoryChart.tsx`
   - `src/components/auto/FuelLogForm.tsx`
   - `src/components/auto/MaintenanceLogForm.tsx`
   - `src/components/auto/ReminderCard.tsx`

3. **Создать страницы** (2-3 часа)
   - Обновить `src/app/auto/page.tsx` - дашборд с метриками и графиками
   - `src/app/auto/fuel/page.tsx` - журнал заправок
   - `src/app/auto/maintenance/page.tsx` - журнал ТО
   - `src/app/auto/settings/page.tsx` - настройки профиля авто

4. **Добавить анимации и полировку** (1 час)
   - Framer Motion анимации
   - Проверка Design System V2
   - Accessibility

## 🎯 Оценка оставшегося времени

- Обновление store: 30 мин
- Калькуляторы: 2-3 часа
- UI компоненты: 2-3 часа
- Страницы: 2-3 часа
- Полировка: 1 час

**Итого: 8-10 часов**

## 📝 Заметки

- Все тексты на русском
- Валюта: ₽ (RUB)
- Дизайн: Glassmorphism (Design System V2)
- Анимации: Framer Motion
- Графики: Recharts (уже установлен)

## 🚀 Готово к продолжению!

Следующий шаг: обновить `src/lib/app-store.tsx` согласно инструкциям выше.

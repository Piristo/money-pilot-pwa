# Интеграция Supabase в MoneyPilot

## Шаг 1: Создание проекта в Supabase

1. Перейдите на https://supabase.com/
2. Нажмите "Start your project"
3. Войдите через GitHub
4. Нажмите "New project"
5. Заполните:
   - **Name**: money-pilot
   - **Database Password**: (придумайте надёжный пароль и сохраните!)
   - **Region**: Europe (Frankfurt) - ближайший к России
   - **Pricing Plan**: Free (достаточно для старта)
6. Нажмите "Create new project"
7. Подождите 2-3 минуты пока создаётся база данных

## Шаг 2: Получение API ключей

После создания проекта:

1. Перейдите в **Settings** → **API**
2. Скопируйте:
   - **Project URL** (например: `https://xxxxx.supabase.co`)
   - **anon public** ключ (начинается с `eyJhbGc...`)

## Шаг 3: Установка зависимостей

```bash
cd money-pilot
npm install @supabase/supabase-js
```

## Шаг 4: Настройка переменных окружения

Создайте файл `.env.local` в корне проекта:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...ваш_ключ
```

**⚠️ Важно:** Файл `.env.local` уже в `.gitignore`, он не попадёт в GitHub!

## Шаг 5: Создание схемы базы данных

Перейдите в **SQL Editor** в Supabase и выполните:

```sql
-- Таблица пользователей (расширение auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Таблица транзакций
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Таблица бюджетов
CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  category TEXT NOT NULL,
  limit_amount DECIMAL(10, 2) NOT NULL,
  period TEXT NOT NULL CHECK (period IN ('daily', 'weekly', 'monthly')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, category, period)
);

-- Таблица профилей автомобилей
CREATE TABLE car_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  mileage INTEGER NOT NULL,
  fuel_type TEXT NOT NULL,
  fuel_consumption DECIMAL(4, 2) NOT NULL,
  tank_capacity INTEGER NOT NULL,
  fuel_price DECIMAL(6, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Таблица заправок
CREATE TABLE fuel_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  date DATE NOT NULL,
  liters DECIMAL(6, 2) NOT NULL,
  cost DECIMAL(10, 2) NOT NULL,
  mileage INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Таблица ТО
CREATE TABLE maintenance_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  date DATE NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  cost DECIMAL(10, 2) NOT NULL,
  mileage INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Таблица напоминаний
CREATE TABLE reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  due_date DATE,
  due_mileage INTEGER,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индексы для производительности
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_budgets_user_id ON budgets(user_id);
CREATE INDEX idx_fuel_logs_user_id ON fuel_logs(user_id);
CREATE INDEX idx_maintenance_logs_user_id ON maintenance_logs(user_id);
CREATE INDEX idx_reminders_user_id ON reminders(user_id);

-- Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE fuel_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

-- Политики доступа (пользователь видит только свои данные)
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions" ON transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions" ON transactions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions" ON transactions
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own budgets" ON budgets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own budgets" ON budgets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own budgets" ON budgets
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own budgets" ON budgets
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own car profile" ON car_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own car profile" ON car_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own car profile" ON car_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own fuel logs" ON fuel_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own fuel logs" ON fuel_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own maintenance logs" ON maintenance_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own maintenance logs" ON maintenance_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own reminders" ON reminders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reminders" ON reminders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reminders" ON reminders
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reminders" ON reminders
  FOR DELETE USING (auth.uid() = user_id);
```

## Шаг 6: Настройка аутентификации

В Supabase перейдите в **Authentication** → **Providers**:

1. **Email** - включите (уже включен по умолчанию)
2. **Google** (опционально):
   - Включите провайдер
   - Получите Client ID и Secret в Google Cloud Console
   - Добавьте Redirect URL из Supabase

## Шаг 7: Добавление Supabase клиента

Создайте файл `src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Типы для базы данных
export type Transaction = {
  id: string
  user_id: string
  amount: number
  category: string
  description: string | null
  date: string
  type: 'income' | 'expense'
  created_at: string
  updated_at: string
}

export type Budget = {
  id: string
  user_id: string
  category: string
  limit_amount: number
  period: 'daily' | 'weekly' | 'monthly'
  created_at: string
  updated_at: string
}

export type CarProfile = {
  id: string
  user_id: string
  brand: string
  model: string
  year: number
  mileage: number
  fuel_type: string
  fuel_consumption: number
  tank_capacity: number
  fuel_price: number
  created_at: string
  updated_at: string
}

export type FuelLog = {
  id: string
  user_id: string
  date: string
  liters: number
  cost: number
  mileage: number
  created_at: string
}

export type MaintenanceLog = {
  id: string
  user_id: string
  date: string
  category: string
  description: string
  cost: number
  mileage: number
  created_at: string
}

export type Reminder = {
  id: string
  user_id: string
  title: string
  type: string
  due_date: string | null
  due_mileage: number | null
  completed: boolean
  created_at: string
  updated_at: string
}
```

## Шаг 8: Миграция данных из localStorage

Создайте утилиту для миграции `src/lib/migrate-to-supabase.ts`:

```typescript
import { supabase } from './supabase'
import { useAppStore } from './app-store'

export async function migrateLocalStorageToSupabase() {
  const store = useAppStore.getState()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User not authenticated')
  }

  try {
    // Миграция транзакций
    if (store.transactions.length > 0) {
      const transactions = store.transactions.map(t => ({
        user_id: user.id,
        amount: t.amount,
        category: t.category,
        description: t.description,
        date: t.date,
        type: t.type
      }))
      
      await supabase.from('transactions').insert(transactions)
    }

    // Миграция бюджетов
    if (store.budgets.length > 0) {
      const budgets = store.budgets.map(b => ({
        user_id: user.id,
        category: b.category,
        limit_amount: b.limit,
        period: b.period
      }))
      
      await supabase.from('budgets').insert(budgets)
    }

    // Миграция профиля автомобиля
    if (store.carProfile) {
      await supabase.from('car_profiles').insert({
        user_id: user.id,
        ...store.carProfile
      })
    }

    // Миграция заправок
    if (store.fuelLogs.length > 0) {
      const fuelLogs = store.fuelLogs.map(f => ({
        user_id: user.id,
        ...f
      }))
      
      await supabase.from('fuel_logs').insert(fuelLogs)
    }

    // Миграция ТО
    if (store.maintenanceLogs.length > 0) {
      const maintenanceLogs = store.maintenanceLogs.map(m => ({
        user_id: user.id,
        ...m
      }))
      
      await supabase.from('maintenance_logs').insert(maintenanceLogs)
    }

    // Миграция напоминаний
    if (store.autoReminders.length > 0) {
      const reminders = store.autoReminders.map(r => ({
        user_id: user.id,
        title: r.title,
        type: r.type,
        due_date: r.dueDate || null,
        due_mileage: r.dueMileage || null,
        completed: r.completed
      }))
      
      await supabase.from('reminders').insert(reminders)
    }

    console.log('Migration completed successfully!')
    return true
  } catch (error) {
    console.error('Migration failed:', error)
    throw error
  }
}
```

## Шаг 9: Настройка Vercel

После деплоя на Vercel:

1. Перейдите в **Settings** → **Environment Variables**
2. Добавьте:
   - `NEXT_PUBLIC_SUPABASE_URL` = ваш URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = ваш ключ
3. Нажмите "Save"
4. Redeploy проект

## Что дальше?

После базовой настройки нужно:

1. **Создать страницу авторизации** (`/login`, `/signup`)
2. **Обновить Zustand store** для работы с Supabase вместо localStorage
3. **Добавить real-time подписки** для синхронизации между устройствами
4. **Реализовать offline-first** с синхронизацией при подключении

## Преимущества Supabase

✅ **Облачное хранилище** - данные не теряются при очистке браузера
✅ **Синхронизация** - работает на всех устройствах пользователя
✅ **Аутентификация** - готовая система входа/регистрации
✅ **Real-time** - изменения видны мгновенно
✅ **Безопасность** - Row Level Security защищает данные
✅ **Бесплатный план** - 500MB БД, 50,000 пользователей

## Полезные ссылки

- Документация Supabase: https://supabase.com/docs
- Next.js + Supabase: https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
- Supabase Auth: https://supabase.com/docs/guides/auth
- Real-time: https://supabase.com/docs/guides/realtime

# 📝 Инструкция: Создание таблиц в Supabase

## Шаг 1: Откройте SQL Editor

1. Перейдите по ссылке: https://supabase.com/dashboard/project/fqbsxwqswcydiopwqgct
2. В левом меню найдите **SQL Editor** (иконка с символом `</>`)
3. Нажмите на него

## Шаг 2: Создайте новый запрос

1. Нажмите кнопку **"New query"** (справа вверху)
2. Откроется пустой редактор SQL

## Шаг 3: Скопируйте SQL скрипт

Откройте файл `supabase-schema.sql` в этой папке и скопируйте **ВСЁ** содержимое.

Или скопируйте отсюда:

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

## Шаг 4: Вставьте и выполните

1. Вставьте скопированный SQL в редактор
2. Нажмите кнопку **"Run"** (или Ctrl+Enter)
3. Подождите несколько секунд

## Шаг 5: Проверьте результат

Если всё прошло успешно, вы увидите:
- ✅ "Success. No rows returned"

Если есть ошибки:
- Прочитайте сообщение об ошибке
- Возможно таблицы уже существуют (это нормально)

## Шаг 6: Проверьте таблицы

1. Обновите страницу: http://localhost:3000/test-supabase
2. Все таблицы должны стать зелёными ✅

## Альтернативный способ: Table Editor

Если SQL Editor не работает:

1. Перейдите в **Table Editor** (слева в меню)
2. Нажмите **"Create a new table"**
3. Создайте каждую таблицу вручную (долго, но работает)

---

## Что делать если ошибка "relation already exists"?

Это значит таблицы уже созданы! Просто обновите страницу `/test-supabase`.

## Что делать если ошибка "permission denied"?

1. Проверьте что вы вошли в правильный проект
2. Убедитесь что у вас есть права администратора проекта

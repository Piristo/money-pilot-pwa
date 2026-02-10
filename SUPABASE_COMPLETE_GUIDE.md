# ✅ Supabase интеграция завершена!

## Что уже сделано:

✅ Supabase проект создан
✅ Все таблицы созданы (7 таблиц)
✅ Row Level Security настроен
✅ Подключение работает
✅ Страницы авторизации созданы (`/login`, `/signup`)
✅ `.env.local` настроен

## Следующие шаги:

### 1. Обновить GitHub

```bash
cd money-pilot
git add .
git commit -m "feat: Add Supabase integration with auth pages"
git push
```

### 2. Настроить Vercel

1. Откройте: https://vercel.com/dashboard
2. Выберите проект `money-pilot-pwa`
3. Settings → Environment Variables
4. Добавьте:

```
NEXT_PUBLIC_SUPABASE_URL = https://fqbsxwqswcydiopvwqct.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxYnN4d3Fzd2N5ZGlvcHZ3cWN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MDI2NDMsImV4cCI6MjA4NjE3ODY0M30.1F2ZQSRp6ppJcBp3YOf1H4OwWrsvTd-7C6fd6DRz5mQ
```

5. Deployments → Redeploy

### 3. Отключить email подтверждение (опционально)

Для быстрого тестирования:

1. Supabase Dashboard → Authentication → Providers
2. Email → Settings
3. Отключите "Confirm email"
4. Сохраните

### 4. Протестировать авторизацию

1. Откройте: http://localhost:3000/signup
2. Зарегистрируйтесь с тестовым email
3. Войдите через /login
4. Проверьте что данные сохраняются

## Что дальше (TODO):

### Обновить Zustand Store

Сейчас приложение использует localStorage. Нужно:

1. Добавить проверку авторизации
2. Заменить localStorage на Supabase запросы
3. Добавить синхронизацию данных
4. Реализовать offline-first подход

### Добавить защиту роутов

Создать middleware для проверки авторизации:
- Если не авторизован → редирект на /login
- Если авторизован → доступ к приложению

### Миграция данных

Создать утилиту для переноса данных из localStorage в Supabase при первом входе.

## Полезные ссылки:

- Supabase Dashboard: https://supabase.com/dashboard/project/fqbsxwqswcydiopvwqct
- Vercel Dashboard: https://vercel.com/dashboard
- GitHub Repo: https://github.com/Piristo/money-pilot-pwa

## Проверка работы:

```bash
# Локально
npm run dev
# Откройте http://localhost:3000/login

# Проверка таблиц
# Откройте http://localhost:3000/test-supabase
```

## Troubleshooting:

**Ошибка "Invalid login credentials"**
- Проверьте правильность email/пароля
- Убедитесь что пользователь зарегистрирован

**Ошибка "Email not confirmed"**
- Проверьте email для подтверждения
- Или отключите email confirmation в Supabase

**Таблицы не найдены**
- Выполните SQL из `supabase-schema-safe.sql`
- Проверьте подключение на `/test-supabase`

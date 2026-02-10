# Исправление ошибки Vercel

## Проблема
```
Error: supabaseUrl is required.
```

Это происходит потому что переменные окружения не были добавлены на Vercel до деплоя.

## Решение

### Шаг 1: Обновить код на GitHub

```bash
cd money-pilot
git add .
git commit -m "fix: Add fallback for Supabase env vars"
git push origin main
```

### Шаг 2: Добавить переменные на Vercel

1. Откройте: https://vercel.com/dashboard
2. Выберите проект `money-pilot-pwa`
3. Settings → Environment Variables
4. Добавьте **ДВЕ** переменные:

**Переменная 1:**
- Key: `NEXT_PUBLIC_SUPABASE_URL`
- Value: `https://fqbsxwqswcydiopvwqct.supabase.co`
- Environments: ✅ Production ✅ Preview ✅ Development

**Переменная 2:**
- Key: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxYnN4d3Fzd2N5ZGlvcHZ3cWN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MDI2NDMsImV4cCI6MjA4NjE3ODY0M30.1F2ZQSRp6ppJcBp3YOf1H4OwWrsvTd-7C6fd6DRz5mQ`
- Environments: ✅ Production ✅ Preview ✅ Development

### Шаг 3: Redeploy

После добавления переменных Vercel автоматически предложит redeploy.

Или вручную:
1. Deployments → последний деплой
2. Три точки → Redeploy
3. Подтвердить

### Шаг 4: Проверка

После успешного деплоя откройте:
```
https://your-app.vercel.app/test-supabase
```

Все таблицы должны быть зелёными ✅

## Важно!

Переменные окружения должны быть добавлены **ДО** деплоя, иначе билд упадёт с ошибкой.

Теперь код имеет fallback, поэтому билд пройдёт даже без переменных, но Supabase не будет работать.

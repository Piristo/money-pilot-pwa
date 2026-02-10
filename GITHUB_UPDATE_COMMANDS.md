# Команды для обновления GitHub

## Шаг 1: Добавить все файлы

```bash
cd money-pilot
git add .
```

## Шаг 2: Создать коммит

```bash
git commit -m "feat: Add Supabase integration with authentication

- Add Supabase client configuration
- Create database schema with 7 tables
- Add Row Level Security policies
- Create login and signup pages
- Add environment variables for Supabase
- Add test page for database connection
- Update documentation with integration guide"
```

## Шаг 3: Отправить на GitHub

```bash
git push origin main
```

## Если возникнет ошибка "branch main doesn't exist"

```bash
git branch -M main
git push -u origin main
```

## Проверка

После push откройте:
https://github.com/Piristo/money-pilot-pwa

Вы должны увидеть новые файлы:
- `src/app/login/page.tsx`
- `src/app/signup/page.tsx`
- `src/lib/supabase.ts`
- `.env.local` (НЕ должен быть в GitHub - он в .gitignore)
- `supabase-schema.sql`
- `SUPABASE_INTEGRATION.md`

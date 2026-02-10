# MoneyPilot - Deployment Guide 🚀

## ✅ Pre-Deployment Checklist

### Completed Features
- ✅ Транзакции с умными категориями
- ✅ Бюджеты с трекингом
- ✅ Аналитика с графиками (Recharts)
- ✅ Auto модуль (дашборд, заправки, ТО, настройки)
- ✅ Toast-уведомления
- ✅ Glassmorphism дизайн
- ✅ Responsive layout
- ✅ Production build успешен

### Build Status
```bash
✓ Compiled successfully
✓ Finished TypeScript
✓ Collecting page data
✓ Generating static pages (10/10)
✓ Finalizing page optimization
```

---

## 📦 GitHub Setup

### 1. Инициализация Git (если ещё не сделано)

```bash
cd money-pilot
git init
git add .
git commit -m "Initial commit: MoneyPilot PWA with Auto Module"
```

### 2. Создание репозитория на GitHub

1. Открой https://github.com/new
2. Название: `money-pilot-pwa`
3. Description: `Personal finance + automobile cost tracker PWA`
4. Public или Private (на твой выбор)
5. НЕ добавляй README, .gitignore, license (уже есть)
6. Создай репозиторий

### 3. Push на GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/money-pilot-pwa.git
git branch -M main
git push -u origin main
```

---

## 🌐 Vercel Deployment

### Вариант 1: Через Vercel CLI (быстро)

```bash
# Установи Vercel CLI (если ещё нет)
npm i -g vercel

# Деплой
cd money-pilot
vercel

# Следуй инструкциям:
# - Set up and deploy? Yes
# - Which scope? (выбери свой аккаунт)
# - Link to existing project? No
# - What's your project's name? money-pilot-pwa
# - In which directory is your code located? ./
# - Want to override the settings? No

# Production deploy
vercel --prod
```

### Вариант 2: Через Vercel Dashboard (рекомендую)

1. **Открой** https://vercel.com/new
2. **Import Git Repository**
   - Выбери GitHub
   - Авторизуйся
   - Выбери репозиторий `money-pilot-pwa`
3. **Configure Project**
   - Framework Preset: **Next.js**
   - Root Directory: `./` (или `money-pilot` если в подпапке)
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`
4. **Environment Variables** (пока не нужны)
5. **Deploy** 🚀

### После деплоя

Vercel автоматически:
- ✅ Создаст production URL: `https://money-pilot-pwa.vercel.app`
- ✅ Настроит CI/CD (каждый push = новый деплой)
- ✅ Добавит SSL сертификат
- ✅ Настроит CDN
- ✅ Включит автоматические превью для PR

---

## 🔧 Post-Deployment

### 1. Проверь работу приложения

Открой production URL и проверь:
- ✅ Главная страница загружается
- ✅ Транзакции работают
- ✅ Бюджеты работают
- ✅ Аналитика показывает графики
- ✅ Auto модуль работает
- ✅ Toast-уведомления появляются
- ✅ Responsive на мобильных

### 2. Настрой Custom Domain (опционально)

В Vercel Dashboard:
1. Settings → Domains
2. Add Domain
3. Введи свой домен (например: `moneypilot.ru`)
4. Следуй инструкциям для настройки DNS

### 3. PWA Setup (опционально)

Для полноценного PWA добавь:
- Service Worker (для offline работы)
- Push notifications
- Install prompt

---

## 📱 Testing Checklist

### Desktop
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

### Mobile
- [ ] iOS Safari
- [ ] Android Chrome
- [ ] Responsive layout

### Features
- [ ] Добавление транзакций
- [ ] Создание бюджетов
- [ ] Просмотр аналитики
- [ ] Настройка автомобиля
- [ ] Добавление заправок
- [ ] Добавление ТО
- [ ] Toast-уведомления

---

## 🐛 Known Issues

### Warnings (не критично)
- ⚠️ `themeColor` и `viewport` в metadata (Next.js 16 рекомендует viewport export)
- ⚠️ Recharts chart size warning (не влияет на работу)
- ⚠️ Multiple lockfiles warning (можно игнорировать)

### Fixes (если нужно)
```bash
# Убрать лишний lockfile
rm C:\Users\Nikolay\Desktop\package-lock.json

# Обновить metadata (опционально)
# Переместить themeColor и viewport в generateViewport()
```

---

## 📊 Performance

### Lighthouse Score (ожидаемый)
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 90+

### Optimization Tips
- ✅ Next.js Image optimization
- ✅ Static generation
- ✅ Code splitting
- ✅ Lazy loading
- ✅ Minification

---

## 🔐 Security

### Current Setup
- ✅ HTTPS (Vercel автоматически)
- ✅ Client-side storage (localStorage)
- ✅ No sensitive data in code
- ✅ No API keys exposed

### Future Improvements
- [ ] Supabase integration (cloud sync)
- [ ] User authentication
- [ ] Data encryption
- [ ] Backup/restore

---

## 📈 Analytics (опционально)

### Vercel Analytics
```bash
npm install @vercel/analytics
```

В `layout.tsx`:
```tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

---

## 🎉 Success!

После деплоя у тебя будет:
- ✅ Production URL
- ✅ Автоматические деплои при push
- ✅ SSL сертификат
- ✅ CDN
- ✅ Превью для PR
- ✅ Работающее PWA приложение

**Production URL:** `https://money-pilot-pwa.vercel.app`

---

## 📞 Support

Если что-то не работает:
1. Проверь Vercel logs: Dashboard → Deployments → Logs
2. Проверь browser console: F12 → Console
3. Проверь Network tab: F12 → Network

---

**Дата:** 10.02.2026  
**Версия:** 1.0.0  
**Status:** ✅ Ready for Production!

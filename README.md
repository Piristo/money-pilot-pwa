# 💰 MoneyPilot PWA

> Personal finance + automobile cost tracker with glassmorphism design

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## ✨ Features

### 💸 Finance Management
- **Транзакции** - Доходы и расходы с умными категориями
- **Бюджеты** - Создание и отслеживание бюджетов
- **Аналитика** - Графики расходов, трендов, категорий
- **Умные категории** - 12 основных + 29 подкатегорий с автоопределением

### 🚗 Auto Module
- **Дашборд** - Метрики: расходы, расход топлива, стоимость за км
- **Заправки** - Журнал заправок с расчётом реального расхода
- **ТО и ремонт** - История обслуживания с категориями
- **Напоминания** - По пробегу, дате, рекуррентные
- **Настройки** - Профиль автомобиля с паспортными данными

### 🎨 Design
- **Glassmorphism** - Современный дизайн с blur эффектами
- **Градиенты** - Emerald, Violet, Orange, Blue
- **Анимации** - Framer Motion для плавных переходов
- **Responsive** - Адаптивный дизайн для всех устройств
- **Dark Mode** - Тёмная тема по умолчанию

### 🔔 Notifications
- **Toast-уведомления** - Успех, ошибка, инфо
- **Автозакрытие** - Через 3 секунды
- **Анимации** - Плавное появление/исчезновение

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm или yarn

### Installation

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/money-pilot-pwa.git
cd money-pilot-pwa

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📦 Tech Stack

### Core
- **Next.js 16.1.6** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **Zustand** - State management

### UI/UX
- **Framer Motion** - Animations
- **Recharts** - Charts and graphs
- **Lucide React** - Icons
- **Glassmorphism** - Modern design style

### Storage
- **localStorage** - Client-side persistence
- **Versioned schema** - v2 with migration

## 📱 Screenshots

### Dashboard
![Dashboard](docs/screenshots/dashboard.png)

### Analytics
![Analytics](docs/screenshots/analytics.png)

### Auto Module
![Auto Module](docs/screenshots/auto.png)

## 🏗️ Project Structure

```
money-pilot/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── analytics/          # Analytics page
│   │   ├── auto/               # Auto module
│   │   │   ├── settings/       # Car settings
│   │   │   └── page.tsx        # Auto dashboard
│   │   ├── budgets/            # Budgets page
│   │   ├── profile/            # Profile page
│   │   ├── transactions/       # Transactions page
│   │   └── layout.tsx          # Root layout
│   ├── components/             # React components
│   │   ├── auto/               # Auto module components
│   │   ├── charts/             # Chart components
│   │   └── ui/                 # UI components
│   └── lib/                    # Utilities
│       ├── analytics/          # Analytics logic
│       ├── auto/               # Auto module logic
│       ├── categories/         # Category system
│       └── app-store.tsx       # Zustand store
├── public/                     # Static assets
└── docs/                       # Documentation
```

## 🎯 Roadmap

### v1.1 (Next)
- [ ] Fuel log page (list of all fill-ups)
- [ ] Maintenance log page (list of all services)
- [ ] Edit/delete records
- [ ] Export data (CSV, PDF)

### v1.2 (Future)
- [ ] Supabase integration (cloud sync)
- [ ] User authentication
- [ ] Multi-currency support
- [ ] Light theme
- [ ] Push notifications

### v2.0 (Long-term)
- [ ] Mobile app (React Native)
- [ ] Shared budgets (family)
- [ ] AI insights
- [ ] Receipt scanning

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@YOUR_USERNAME](https://github.com/YOUR_USERNAME)
- Email: your.email@example.com

## 🙏 Acknowledgments

- Design inspiration: Modern fintech apps
- Icons: [Lucide](https://lucide.dev/)
- Charts: [Recharts](https://recharts.org/)
- Animations: [Framer Motion](https://www.framer.com/motion/)

---

Made with ❤️ and ☕ in Russia 🇷🇺
